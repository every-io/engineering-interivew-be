import { TaskCreateDto } from '../../../domain/dtos/task-create.dto';
import { TaskUpdateDto } from '../../../domain/dtos/task-update.dto';
import { Task } from '../../../domain/entities/task.entity';

export interface TaskRepositoryInterface {
    getAllTasks(): Promise<Task[] | undefined>;
    createTask(taskDto: TaskCreateDto): Promise<void>;
    getTaskById(id: number): Promise<Task | undefined>;
    updateTask(id: number, taskDto: TaskUpdateDto): Promise<void>;
    resetTaskData(): Promise<void>;
  }