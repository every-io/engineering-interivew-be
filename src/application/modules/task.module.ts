import { Module } from '@nestjs/common';
import { CreateTasksService } from '../../domain/services/create-tasks.service';
import { GetTasksService } from '../../domain/services/get-tasks.service';
import { UpdateTasksService } from '../../domain/services/update-tasks.service';
import { TaskRepository } from '../../infrastructure/repositories/task.repository';
import { TaskController } from '../controllers/task.controller';

@Module({
  controllers: [TaskController],
  providers: [
    {
        provide: 'TaskRepositoryInterface',
        useClass: TaskRepository,
    },
    GetTasksService, 
    CreateTasksService, 
    UpdateTasksService],
})
export class TaskModule {}
