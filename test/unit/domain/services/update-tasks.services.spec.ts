import { expect } from 'chai';
import {
  anything,
  instance,
  mock,
  reset,
  verify,
  when,
} from 'ts-mockito';
import { TaskRepositoryInterface } from '../../../../src/infrastructure/repositories/interfaces/task-repository.interface';
import { UpdateTasksService } from '../../../../src/domain/services/update-tasks.service';
import { TaskUpdateDto } from '../../../../src/domain/dtos/task-update.dto';
import { TaskStatus } from '../../../../src/domain/enums/task-status.enum';
import { TaskNotFoundError } from '../../../../src/domain/exceptions/update-tasks.exception';
import { fail } from 'assert';
import { TaskFactory } from '../../../factory/task.factory';

describe('UpdateTasksService', () => {
  const mockedTaskRepository: TaskRepositoryInterface = mock<TaskRepositoryInterface>();
  const updateTasksService = new UpdateTasksService(instance(mockedTaskRepository));
  const notFoundTaskId = 2;
  const foundTaskId = 1;

  beforeEach(() => {
    reset(mockedTaskRepository);
  });

  context('when task not found', () => {
    beforeEach(() => {
      when(mockedTaskRepository.getTaskById(notFoundTaskId)).thenResolve(undefined);    
    });

    it('should throw TaskNotFoundError', async () => {
      const updateDto: TaskUpdateDto = {
        status: TaskStatus.IN_PROGRESS,
        title: 'Task 100',
        description: 'Task 100 description',
      }

      try {
        await updateTasksService.updateTask(notFoundTaskId, updateDto);
        fail();
      } catch (e) {
        verify(
          mockedTaskRepository.updateTask(anything(), anything()),
        ).never();
        expect(e).to.be.instanceof(TaskNotFoundError);
      }
    });
  });

  context('when task found', () => {
    const task = TaskFactory.build();

    beforeEach(() => {
      when(mockedTaskRepository.getTaskById(foundTaskId)).thenResolve(task);    
    });

    it('should update the task', async () => {
      const updateDto: TaskUpdateDto = {
        status: TaskStatus.IN_PROGRESS,
        title: 'Task 100',
        description: 'Task 100 description',
      }

      await updateTasksService.updateTask(foundTaskId, updateDto);
      verify(
        mockedTaskRepository.updateTask(foundTaskId, updateDto),
      ).once();
    });
  });
});
