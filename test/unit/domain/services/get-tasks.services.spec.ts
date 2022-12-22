import { expect } from 'chai';
import {
  instance,
  mock,
  reset,
  when,
} from 'ts-mockito';
import { TaskRepositoryInterface } from '../../../../src/infrastructure/repositories/interfaces/task-repository.interface';
import { GetTasksService } from '../../../../src/domain/services/get-tasks.service';
import { TaskData } from '../../../../src/infrastructure/repositories/mocks/task-data';

describe('GetTasksService', () => {
  const mockedTaskRepository: TaskRepositoryInterface = mock<TaskRepositoryInterface>();
  const getTasksService = new GetTasksService(instance(mockedTaskRepository));

  beforeEach(() => {
    reset(mockedTaskRepository);
    when(mockedTaskRepository.getAllTasks()).thenResolve(
      TaskData.getMockTasks()
    );
  });

  context('when get all tasks', () => {
    it('should return all tasks', async () => {
      const allTasks = await getTasksService.getAllTasks();
      expect(allTasks).to.be.deep.equal(TaskData.getMockTasks());
    });
  });
});
