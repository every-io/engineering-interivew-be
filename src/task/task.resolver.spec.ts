import { Test, TestingModule } from '@nestjs/testing';
import * as Chance from 'chance';
import { CreateTaskDTO, Status } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';

const chance = new Chance();
const GLOBAL_TASK_ID = 123;

const createTaskInput: CreateTaskDTO = {
  name: chance.first(),
  description: chance.word(),
  status: Status.IN_PROGRESS,
};

const updateTaskInput: UpdateTaskDTO = {
  id: GLOBAL_TASK_ID,
  name: chance.last(),
  description: chance.word(),
  status: Status.ARCHIVED,
};

describe('UsersResolver', () => {
  let taskResolver: TaskResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskResolver,
        {
          provide: TaskService,
          useValue: {
            findAll: jest.fn(() => {
              return [
                {
                  id: GLOBAL_TASK_ID,
                  ...createTaskInput,
                },
              ];
            }),
            create: jest.fn(() => {
              return {
                id: GLOBAL_TASK_ID,
                ...createTaskInput,
              };
            }),
            findOne: jest.fn(() => {
              return {
                id: GLOBAL_TASK_ID,
                ...createTaskInput,
              };
            }),
            update: jest.fn(() => {
              return {
                id: GLOBAL_TASK_ID,
                ...createTaskInput,
                ...updateTaskInput,
              };
            }),
            remove: jest.fn(() => {
              return {
                id: GLOBAL_TASK_ID,
                ...createTaskInput,
              };
            }),
          },
        },
      ],
    }).compile();

    taskResolver = module.get<TaskResolver>(TaskResolver);
  });

  it('should be defined', () => {
    expect(taskResolver).toBeDefined();
  });

  it('should be able to create a tasks', async () => {
    const task = await taskResolver.createTask(createTaskInput);
    expect(task).toBeDefined();
    expect(task.id).toBe(GLOBAL_TASK_ID);
    expect(task.name).toBe(createTaskInput.name);
    expect(task.description).toBe(createTaskInput.description);
    expect(task.status).toBe(createTaskInput.status);
    expect(task.userId).toBe(createTaskInput.userId);
  });

  it('should be able to list all tasks', async () => {
    const tasks = await taskResolver.findAll();
    expect(tasks).toBeDefined();
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks[0].id).toBe(GLOBAL_TASK_ID);
  });
  it('should be able to find one task by id', async () => {
    const task = await taskResolver.findOne(GLOBAL_TASK_ID);
    expect(task).toBeDefined();
    expect(task.id).toBe(GLOBAL_TASK_ID);
  });
  it('should be able to test updateTasl ', async () => {
    const updatedTask = await taskResolver.updateTask(updateTaskInput);
    expect(updatedTask).toBeDefined();
    expect(updatedTask.name).toBe(updateTaskInput.name);
    expect(updatedTask.description).toBe(updateTaskInput.description);
  });

  it('should be able to test removeTask ', async () => {
    const removedTask = await taskResolver.removeTask(GLOBAL_TASK_ID);
    expect(removedTask).toBeDefined();
    expect(removedTask.id).toBe(GLOBAL_TASK_ID);
    expect(removedTask.name).toBe(createTaskInput.name);
  });
});
