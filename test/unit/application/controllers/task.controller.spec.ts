import { BadRequestException, NotFoundException } from '@nestjs/common';
import { fail } from 'assert';
import { expect } from 'chai';
import { resetCalls, verify } from 'ts-mockito';
import { anything, instance, mock, when } from 'ts-mockito';
import { TaskController } from '../../../../src/application/controllers/task.controller';
import { TaskCreateDto } from '../../../../src/domain/dtos/task-create.dto';
import { TaskUpdateDto } from '../../../../src/domain/dtos/task-update.dto';
import { TaskStatus } from '../../../../src/domain/enums/task-status.enum';
import { TaskNotFoundError } from '../../../../src/domain/exceptions/update-tasks.exception';
import { CreateTasksService } from '../../../../src/domain/services/create-tasks.service';
import { GetTasksService } from '../../../../src/domain/services/get-tasks.service';
import { UpdateTasksService } from '../../../../src/domain/services/update-tasks.service';
import { TaskData } from '../../../../src/infrastructure/repositories/mocks/task-data';

describe('TaskController', () => {
  const getTasksServiceMock = mock(GetTasksService);
  const createTasksServiceMock = mock(CreateTasksService);
  const updateTasksServiceMock = mock(UpdateTasksService);
  const notFoundTaskId = 2;
  const foundTaskId = 1;

  const controller = new TaskController(
      instance(getTasksServiceMock),
      instance(createTasksServiceMock),
      instance(updateTasksServiceMock),
  );

  before(() => {
    when(getTasksServiceMock.getAllTasks()).thenResolve(TaskData.getMockTasks());
  });

  beforeEach(() => {
    resetCalls(getTasksServiceMock);
    resetCalls(createTasksServiceMock);
    resetCalls(updateTasksServiceMock);  
  });

  context('when get all tasks', () => {
    it('should return all tasks', async () => {
      const allTasks = await controller.getAllTasks();
      expect(allTasks).to.be.deep.equal(TaskData.getMockTasks());
    });
  });

  context('when create a new task without title', () => {
    it('should throw BadRequestException', async () => {
      const task: TaskCreateDto = {
        description: 'Description',
      };

      try {
        await controller.createTask(task);
        fail();
      } catch (e) {
        verify(
            createTasksServiceMock.createTask(anything()),
        ).never();
        expect(e).to.be.instanceof(BadRequestException);
      }
    });
  });

  context('when create a new task without description', () => {
    it('should throw BadRequestException', async () => {
      const task: TaskCreateDto = {
        title: 'Title',
      };

      try {
        await controller.createTask(task);
        fail();
      } catch (e) {
        verify(
            createTasksServiceMock.createTask(anything()),
        ).never();
        expect(e).to.be.instanceof(BadRequestException);
      }
    });
  });

  context('when create a new task', () => {
    it('should create a new task', async () => {
      const task: TaskCreateDto = {
        title: 'Title',
        description: 'Description',
      };

      await controller.createTask(task);
      verify(
        createTasksServiceMock.createTask(task),
      ).once();
    });
  });

  context('when update a not found task', () => {
    const task: TaskUpdateDto = {
        status: TaskStatus.ARCHIVED,
    };

    beforeEach(() => {
        when(updateTasksServiceMock.updateTask(notFoundTaskId, task)).thenThrow(new TaskNotFoundError('Error'));    
    });

    it('should throw NotFoundException', async () => {
      try {
        await controller.updateTask(task, notFoundTaskId);
        fail();
      } catch (e) {
        expect(e).to.be.instanceof(NotFoundException);
      }
    });
  });

  context('when update a task', () => {
    const task: TaskUpdateDto = {
        status: TaskStatus.ARCHIVED,
    };

    it('should update a task', async () => {
      try {
        await controller.updateTask(task, foundTaskId);
      } catch (e) {
        fail();
      }
    });
  });
});
