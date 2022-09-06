import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CONTEXT, GraphQLExecutionContext } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { Task } from '@prismaConfig/@generated/task/task.model';
import { User } from '@prismaConfig/@generated/user/user.model';
import { PrismaService } from '@/prisma.service';
import * as Chance from 'chance';
import { CreateTaskDTO, Status } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { TaskService } from './task.service';

const chance = new Chance();
const fakeTasks: Task[] = [];
const GLOBAL_TASK_ID = 1234;

const user: User = {
  id: chance.integer({ min: 1, max: 1000 }),
  email: chance.email(),
  name: chance.first(),
  password: chance.string({ length: 15 }),
  isAdmin: chance.bool({
    likelihood: 50,
  }),
  createdAt: chance.date(),
  updateAt: chance.date(),
};

const updateTaskInput: UpdateTaskDTO = {
  id: GLOBAL_TASK_ID,
  name: chance.word(),
  status: Status.IN_PROGRESS,
};

const createFakeTasks = () => {
  fakeTasks.length = 0;
  for (let i = 1; i < 10; i++) {
    const task = {
      id: i,
      name: chance.word(),
      description: chance.word(),
      createdAt: chance.date(),
      updateAt: chance.date(),
      userId: i + 1,
    } as Task;

    fakeTasks.push(task);
  }
};

const CONTEXT_DATA = {
  req: {
    user: user,
  },
};

describe('TaskService', () => {
  let service: TaskService;
  let prismaService: PrismaService;
  let context: GraphQLExecutionContext;

  beforeAll(async () => {
    createFakeTasks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        TaskService,
        {
          provide: CONTEXT,
          useValue: {
            req: {
              user: user,
            },
            getContext: jest.fn(() => {
              return CONTEXT_DATA;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prismaService = module.get<PrismaService>(PrismaService);
    context = module.get<GraphQLExecutionContext>(CONTEXT);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get a list of all tasks if user is admin', async () => {
    context.getContext().req.user.isAdmin = true;
    prismaService.task.findMany = jest.fn().mockReturnValue(fakeTasks);

    const users = await service.findAll();
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(9);
    expect(users[0].name).toBe(fakeTasks[0].name);
    expect(users[0].description).toBe(fakeTasks[0].description);
  });

  it('should get a task given an id', async () => {
    context.getContext().req.user.isAdmin = true;

    const randomTaskId = Math.floor(Math.random() * 9);
    const taskId = fakeTasks[randomTaskId].id;
    fakeTasks[randomTaskId].userId = context.getContext().req.user.id;
    prismaService.task.findUnique = jest
      .fn()
      .mockReturnValueOnce(fakeTasks[randomTaskId]);

    const task = await service.findOne(randomTaskId);
    expect(task.id).toBe(taskId);
    expect(task.name).toBe(fakeTasks[randomTaskId].name);
    expect(task.description).toBe(fakeTasks[randomTaskId].description);
    expect(task.userId).toBe(fakeTasks[randomTaskId].userId);
  });

  it('should not be able to get the task from antoher user if user is non admin', async () => {
    context.getContext().req.user.isAdmin = false;
    context.getContext().req.user.id = 1234;

    const randomTaskId = Math.floor(Math.random() * 9);
    fakeTasks[randomTaskId].userId = 5678;

    prismaService.task.findUnique = jest
      .fn()
      .mockReturnValueOnce(fakeTasks[randomTaskId]);

    await expect(service.findOne(randomTaskId)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should be able to list the task which belongs a non admin user', async () => {
    const userId = chance.integer({ min: 100 });
    context.getContext().req.user.id = userId;
    context.getContext().req.user.isAdmin = false;

    fakeTasks.forEach((c) => (c.userId = userId));

    prismaService.task.findMany = jest.fn().mockReturnValueOnce(fakeTasks);

    const tasks = await service.findAll();
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBe(fakeTasks.length);
    expect(tasks[0].userId).toBe(userId);
  });

  it('should update some user properties', async () => {
    const userId = context.getContext().req.user.id;

    prismaService.task.findUnique = jest.fn().mockReturnValueOnce({
      id: GLOBAL_TASK_ID,
      userId: userId,
      ...updateTaskInput,
    });

    prismaService.task.update = jest.fn().mockReturnValueOnce({
      id: GLOBAL_TASK_ID,
      userId: userId,
      ...updateTaskInput,
    });

    updateTaskInput.id = GLOBAL_TASK_ID;

    const updatedTask = await service.update(
      updateTaskInput.id,
      updateTaskInput,
    );
    expect(updatedTask.id).toBe(GLOBAL_TASK_ID);
    expect(updatedTask.name).toBe(updateTaskInput.name);
    expect(updatedTask.description).toBe(updateTaskInput.description);
    expect(updatedTask.userId).toBe(userId);
  });

  it('should be able to create a new task', async () => {
    const newTaskInput: CreateTaskDTO = {
      name: chance.word(),
      description: chance.word(),
      status: Status.IN_PROGRESS,
    };

    const createdTask = {
      id: chance.integer({ min: 100 }),
      createdAt: chance.date(),
      updatedAt: chance.date(),
      ...newTaskInput,
    } as Task;

    prismaService.task.create = jest.fn().mockReturnValueOnce(createdTask);

    const task = await service.create(newTaskInput);
    expect(task).toBeDefined();
    expect(task.id).toBe(createdTask.id);
    expect(task.name).toBe(newTaskInput.name);
    expect(task.description).toBe(newTaskInput.description);
  });

  it('should not be able to create a new task to another user as non admin user', async () => {
    context.getContext().req.user.id = 5678;
    context.getContext().req.user.isAdmin = false;

    const newTaskInput = {
      name: chance.word(),
      description: chance.word(),
      status: Status.DONE,
      userId: 123,
    } as CreateTaskDTO;

    prismaService.task.create = jest.fn().mockReturnValueOnce(fakeTasks[0]);
    await expect(service.create(newTaskInput)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should be able to remove a task from another user as admin', async () => {
    const randomTaskId = Math.floor(Math.random() * 9);

    context.getContext().req.user.id = 5678;
    context.getContext().req.user.isAdmin = true;

    prismaService.task.findUnique = jest
      .fn()
      .mockReturnValueOnce(fakeTasks[randomTaskId]);
    prismaService.task.delete = jest
      .fn()
      .mockReturnValueOnce(fakeTasks[randomTaskId]);

    const removedTask = await service.remove(randomTaskId);

    expect(removedTask.id).toBe(fakeTasks[randomTaskId].id);
    expect(removedTask.name).toBe(fakeTasks[randomTaskId].name);
    expect(removedTask.description).toBe(fakeTasks[randomTaskId].description);
    expect(removedTask.userId).toBe(fakeTasks[randomTaskId].userId);
  });

  it('should not be able to remove a task from another user as non admin', async () => {
    const randomTaskId = Math.floor(Math.random() * 9);

    context.getContext().req.user.id = 5678;
    context.getContext().req.user.isAdmin = false;

    prismaService.task.findUnique = jest
      .fn()
      .mockReturnValueOnce(fakeTasks[randomTaskId]);
    prismaService.task.delete = jest
      .fn()
      .mockReturnValueOnce(fakeTasks[randomTaskId]);

    await expect(service.remove(randomTaskId)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should be able to remove a task that belongs to the user', async () => {
    context.getContext().req.user.id = 5678;
    context.getContext().req.user.isAdmin = false;

    const randomTaskId = Math.floor(Math.random() * 9);
    fakeTasks[randomTaskId].userId = context.getContext().req.user.id;

    prismaService.task.findUnique = jest
      .fn()
      .mockReturnValueOnce(fakeTasks[randomTaskId]);
    prismaService.task.delete = jest
      .fn()
      .mockReturnValueOnce(fakeTasks[randomTaskId]);

    const removedTask = await service.remove(randomTaskId);
    expect(removedTask.id).toBe(fakeTasks[randomTaskId].id);
    expect(removedTask.userId).toBe(fakeTasks[randomTaskId].userId);
    expect(removedTask.name).toBe(fakeTasks[randomTaskId].name);
    expect(removedTask.description).toBe(fakeTasks[randomTaskId].description);
  });

  it('should not be able to update a non existing task', async () => {
    prismaService.task.findUnique = jest
      .fn()
      .mockReturnValueOnce(fakeTasks[GLOBAL_TASK_ID]);

    expect(service.update(GLOBAL_TASK_ID, updateTaskInput)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should not be able to update a task that belongs to another user', async () => {
    context.getContext().req.user.id = 5678;
    context.getContext().req.user.isAdmin = false;

    const randomTaskId = Math.floor(Math.random() * 9);
    fakeTasks[randomTaskId].userId = 1234;

    prismaService.task.findUnique = jest
      .fn()
      .mockReturnValueOnce(fakeTasks[randomTaskId]);

    expect(service.update(GLOBAL_TASK_ID, updateTaskInput)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should be able to update a task that belongs to another user as admin', async () => {
    context.getContext().req.user.id = 5678;
    context.getContext().req.user.isAdmin = true;

    const randomTaskId = Math.floor(Math.random() * 9);
    fakeTasks[randomTaskId].userId = 1234;

    prismaService.task.findUnique = jest
      .fn()
      .mockReturnValueOnce(fakeTasks[randomTaskId]);

    prismaService.task.update = jest
      .fn()
      .mockReturnValueOnce(fakeTasks[randomTaskId]);

    const updatedTask = await service.update(randomTaskId, updateTaskInput);
    expect(updatedTask.id).toBe(fakeTasks[randomTaskId].id);
    expect(updatedTask.name).toBe(fakeTasks[randomTaskId].name);
    expect(updatedTask.description).toBe(fakeTasks[randomTaskId].description);
    expect(updatedTask.userId).not.toBe(context.getContext().req.user.id);
  });
});
