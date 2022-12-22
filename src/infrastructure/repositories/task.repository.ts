import { TaskCreateDto } from '../../domain/dtos/task-create.dto';
import { TaskUpdateDto } from '../../domain/dtos/task-update.dto';
import { Task } from '../../domain/entities/task.entity';
import { TaskStatus } from '../../domain/enums/task-status.enum';
import { TaskRepositoryInterface } from './interfaces/task-repository.interface';
import { TaskData } from './mocks/task-data';

let allTasks = TaskData.getMockTasks();

export class TaskRepository implements TaskRepositoryInterface {
    public async getAllTasks(): Promise<Task[] | undefined> {
        return allTasks;
    }

    public async getTaskById(id: number): Promise<Task | undefined> {
        return allTasks.find(task => task.id == id);
    }

    public async createTask(taskDto: TaskCreateDto): Promise<void> {
        const newTask: Task = {
            id: this.generateNextId(),
            title: taskDto.title!,
            description: taskDto.description!,
            status: TaskStatus.TO_DO, 
        }

        allTasks.push(newTask);
    }

    public async updateTask(id: number, taskDto: TaskUpdateDto): Promise<void> {
        const taskToUpdate = await this.getTaskById(id);

        if (!taskToUpdate) {
            return;
        }

        if (taskDto.title) {
            taskToUpdate.title = taskDto.title;
        }

        if (taskDto.description) {
            taskToUpdate.description = taskDto.description;
        }

        if (taskDto.status) {
            taskToUpdate.status = taskDto.status;
        }
    }

    public async resetTaskData(): Promise<void> {
        allTasks = TaskData.getMockTasks();
    }

    private generateNextId(): number {
        return allTasks.length + 1;
    }
}