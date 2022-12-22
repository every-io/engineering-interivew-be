import { Inject } from '@nestjs/common';
import { TaskRepositoryInterface } from '../../infrastructure/repositories/interfaces/task-repository.interface';
import { Task } from '../entities/task.entity';

export class GetTasksService {
    public constructor(
      @Inject('TaskRepositoryInterface')
      private readonly taskRepository: TaskRepositoryInterface,
    ) {}
  
    public async getAllTasks(): Promise<Task[] | undefined> {
      return await this.taskRepository.getAllTasks();
    }
  }