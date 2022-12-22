import { Inject } from '@nestjs/common';
import { TaskRepositoryInterface } from '../../infrastructure/repositories/interfaces/task-repository.interface';
import { TaskUpdateDto } from '../dtos/task-update.dto';
import { TaskNotFoundError } from '../exceptions/update-tasks.exception';

export class UpdateTasksService {
    public constructor(
      @Inject('TaskRepositoryInterface')
      private readonly taskRepository: TaskRepositoryInterface,
    ) {}
  
    public async updateTask(id: number, taskDto: TaskUpdateDto): Promise<void> {
      const taskToUpdate = await this.taskRepository.getTaskById(id);

      if (!taskToUpdate) {
        throw new TaskNotFoundError(`Task with id ${id} not found.`);
      }

      await this.taskRepository.updateTask(id, taskDto);
    }
  }