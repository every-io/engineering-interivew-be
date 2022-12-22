import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { TaskCreateDto } from '../../domain/dtos/task-create.dto';
import { TaskUpdateDto } from '../../domain/dtos/task-update.dto';
import { Task } from '../../domain/entities/task.entity';
import { TaskStatus } from '../../domain/enums/task-status.enum';
import { TaskNotFoundError } from '../../domain/exceptions/update-tasks.exception';
import { CreateTasksService } from '../../domain/services/create-tasks.service';
import { GetTasksService } from '../../domain/services/get-tasks.service';
import { UpdateTasksService } from '../../domain/services/update-tasks.service';
import { TaskGuard } from '../guards/task.guard';

@Controller('/tasks')
export class TaskController {
  public constructor(
    private readonly getTasksService: GetTasksService,
    private readonly createTasksService: CreateTasksService,
    private readonly updateTasksService: UpdateTasksService) 
  {}

  @UseGuards(TaskGuard)
  @Get()
  public async getAllTasks(): Promise<Task[] | undefined> {
    return await this.getTasksService.getAllTasks();
  }

  @UseGuards(TaskGuard)
  @Post()
  public async createTask(@Body() task?: TaskCreateDto): Promise<void> {
    if (!task || !task?.description || !task?.title) {
      throw new BadRequestException('Title and Description are required.');
    }

    await this.createTasksService.createTask(task!);
  } 

  @UseGuards(TaskGuard)
  @Put(':id')
  public async updateTask(
    @Body() task: TaskUpdateDto,
    @Param('id') id: number,
  ): Promise<void> {
    if (task.status && !Object.values(TaskStatus).includes(task.status)) {
      throw new BadRequestException('Status invalid.');
    }

    try {
      await this.updateTasksService.updateTask(id, task);
    } catch (e) {
      throw TaskController.dealWithErrors(e as Error);
    }
  }

  private static dealWithErrors(e: Error): Error {
    if (e instanceof TaskNotFoundError) {
      throw new NotFoundException(e.message);
    }

    throw e;
  }
}
