import {
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { Task } from '@prismaConfig/@generated/task/task.model';
import { PrismaService } from '@/prisma.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';

export class TaskService {
  constructor(
    @Inject(CONTEXT) private context,
    private readonly prisma: PrismaService,
  ) {}

  async create(createTaskInput: CreateTaskDTO): Promise<Task> {
    const isNotTheSameUser =
      createTaskInput.userId &&
      createTaskInput.userId !== this.context.req.user.id;

    if (isNotTheSameUser && !this.context.req.user.isAdmin) {
      throw new UnauthorizedException(
        'You cannot create tasks from other users.',
      );
    }

    return await this.prisma.task.create({ data: createTaskInput });
  }

  findAll(): Promise<Task[]> {
    if (this.context.req.user.isAdmin) {
      return this.prisma.task.findMany({
        include: { user: true },
      });
    }

    return this.prisma.task.findMany({
      where: { userId: this.context.req.user.id },
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.findTaskById(id);
    const isNotTheSameUser =
      task.userId && task.userId !== this.context.req.user.id;

    if (isNotTheSameUser && !this.context.req.user.isAdmin) {
      throw new UnauthorizedException('You cannot see tasks from other users.');
    }

    return task;
  }

  private findTaskById(id: number) {
    return this.prisma.task.findUnique({
      where: { id: id },
      include: { user: true },
    });
  }

  async update(id: number, updateTaskInput: UpdateTaskDTO): Promise<Task> {
    const task = await this.findTaskById(id);

    if (!task) {
      throw new NotFoundException();
    }

    const userIsNotTaskOwner =
      task.userId && task.userId !== this.context.req.user.id;

    if (userIsNotTaskOwner && !this.context.req.user.isAdmin) {
      throw new UnauthorizedException(
        'You cannot update tasks from other users.',
      );
    }

    return this.prisma.task.update({
      where: { id },
      data: updateTaskInput,
    });
  }

  async remove(id: number): Promise<Task> {
    const task = await this.findTaskById(id);

    const userIsNotTaskOwner =
      task.userId && task.userId !== this.context.req.user.id;

    if (userIsNotTaskOwner && !this.context.req.user.isAdmin) {
      throw new UnauthorizedException(
        'You cannot remove tasks from other users.',
      );
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
