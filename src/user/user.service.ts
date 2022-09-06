import { Injectable } from '@nestjs/common';
import { User } from '@prismaConfig/@generated/user/user.model';
import { PrismaService } from '@/prisma.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserInput: CreateUserDTO): Promise<User> {
    return this.prisma.user.create({ data: createUserInput });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: { tasks: true },
    });
  }

  findOne(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { tasks: true },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  update(id: number, updateUserInput: UpdateUserDTO): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserInput,
    });
  }

  remove(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
