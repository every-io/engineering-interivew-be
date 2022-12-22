import { Inject } from '@nestjs/common';
import { TaskRepositoryInterface } from '../../infrastructure/repositories/interfaces/task-repository.interface';
import { TaskCreateDto } from '../dtos/task-create.dto';

export class CreateTasksService {
    public constructor(
      @Inject('TaskRepositoryInterface')
      private readonly taskRepository: TaskRepositoryInterface,
    ) {}
  
    public async createTask(taskDto: TaskCreateDto): Promise<void> {
      await this.taskRepository.createTask(taskDto);
    }
  }