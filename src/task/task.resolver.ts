import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { Task } from '@prismaConfig/@generated/task/task.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation(() => Task)
  @UseGuards(JwtAuthGuard)
  createTask(@Args('createTaskInput') createTaskInput: CreateTaskDTO) {
    return this.taskService.create(createTaskInput);
  }

  @Query(() => [Task], { name: 'tasks', complexity: 5 })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.taskService.findAll();
  }

  @Query(() => Task, { name: 'task', complexity: 5 })
  @UseGuards(JwtAuthGuard)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.taskService.findOne(id);
  }

  @Mutation(() => Task)
  @UseGuards(JwtAuthGuard)
  updateTask(@Args('updateTaskInput') updateTaskInput: UpdateTaskDTO) {
    return this.taskService.update(updateTaskInput.id, updateTaskInput);
  }

  @Mutation(() => Task)
  @UseGuards(JwtAuthGuard)
  removeTask(@Args('id', { type: () => Int }) id: number) {
    return this.taskService.remove(id);
  }
}
