import { expect } from 'chai';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { TaskRepositoryInterface } from '../../../../src/infrastructure/repositories/interfaces/task-repository.interface';
import { TaskData } from '../../../../src/infrastructure/repositories/mocks/task-data';
import { TaskCreateDto } from '../../../../src/domain/dtos/task-create.dto';
import { TaskUpdateDto } from '../../../../src/domain/dtos/task-update.dto';
import { TaskStatus } from '../../../../src/domain/enums/task-status.enum';

describe('TaskRepository', () => {
  let app: INestApplication;
  let taskRepository: TaskRepositoryInterface;
  
  before(async () => {
    const module = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    taskRepository = app.get('TaskRepositoryInterface');

    await app.init();
  });

  after(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await taskRepository.resetTaskData();
  });

  afterEach(async () => {
    await taskRepository.resetTaskData();
  });

  context('when get all tasks', () => {
    it('should return all tasks', async () => {
      const allTasks = await taskRepository.getAllTasks();
      expect(allTasks).to.be.deep.equal(TaskData.getMockTasks());
    });
  });

  context('when create a new task', () => {
    it('should return the new task', async () => {
      const newTask: TaskCreateDto = {
        title: 'Task 100',
        description: 'Description task 100',
      }

      await taskRepository.createTask(newTask);
      const allTasks = await taskRepository.getAllTasks();
      const task100 = allTasks?.find(task => task.title == 'Task 100');
      expect(task100).to.be.not.undefined;
    });
  });

  context('when update the task title', () => {
    it('should return the task with the new title', async () => {
      const updateDto: TaskUpdateDto = {
        title: 'Task 100',
      }

      await taskRepository.updateTask(1, updateDto);
      const allTasks = await taskRepository.getAllTasks();
      const originalTask1 = TaskData.getMockTasks().find(task => task.id == 1);
      const task1 = allTasks?.find(task => task.id == 1);
      expect(task1?.title).to.be.equal(updateDto.title);
      expect(task1?.description).to.be.equal(originalTask1?.description);
      expect(task1?.status).to.be.equal(originalTask1?.status);
    });
  });

  context('when update the task description', () => {
    it('should return the task with the new description', async () => {
      const updateDto: TaskUpdateDto = {
        description: 'Task 100 description',
      }

      await taskRepository.updateTask(1, updateDto);
      const allTasks = await taskRepository.getAllTasks();
      const originalTask1 = TaskData.getMockTasks().find(task => task.id == 1);
      const task1 = allTasks?.find(task => task.id == 1);
      expect(task1?.description).to.be.equal(updateDto.description);
      expect(task1?.title).to.be.equal(originalTask1?.title);
      expect(task1?.status).to.be.equal(originalTask1?.status);
    });
  });

  context('when update the task status', () => {
    it('should return the task with the new status', async () => {
      const updateDto: TaskUpdateDto = {
        status: TaskStatus.IN_PROGRESS,
      }

      await taskRepository.updateTask(1, updateDto);
      const allTasks = await taskRepository.getAllTasks();
      const originalTask1 = TaskData.getMockTasks().find(task => task.id == 1);
      const task1 = allTasks?.find(task => task.id == 1);
      expect(task1?.status).to.be.equal(updateDto.status);
      expect(task1?.title).to.be.equal(originalTask1?.title);
      expect(task1?.description).to.be.equal(originalTask1?.description);
    });
  });

  context('when update the task status, description and title', () => {
    it('should return the task with the new status, description and title', async () => {
      const updateDto: TaskUpdateDto = {
        status: TaskStatus.IN_PROGRESS,
        title: 'Task 100',
        description: 'Task 100 description',
      }

      await taskRepository.updateTask(2, updateDto);
      const allTasks = await taskRepository.getAllTasks();
      const task2 = allTasks?.find(task => task.id == 2);
      expect(task2?.status).to.be.equal(updateDto.status);
      expect(task2?.title).to.be.equal(updateDto.title);
      expect(task2?.description).to.be.equal(updateDto.description);
    });
  });
});
