import { Task } from '../../../domain/entities/task.entity';
import { TaskStatus } from '../../../domain/enums/task-status.enum';

export class TaskData {
  public static getMockTasks(): Task[] {
    const task1: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description task 1',
        status: TaskStatus.TO_DO, 
    }
    
    const task2: Task = {
        id: 2,
        title: 'Task 2',
        description: 'Description task 2',
        status: TaskStatus.IN_PROGRESS, 
    }
    
    const task3: Task = {
        id: 3,
        title: 'Task 3',
        description: 'Description task 3',
        status: TaskStatus.DONE, 
    }
    
    const task4: Task = {
        id: 4,
        title: 'Task 4',
        description: 'Description task 4',
        status: TaskStatus.ARCHIVED, 
    }
    
    return [task1, task2, task3, task4];
  }
}
