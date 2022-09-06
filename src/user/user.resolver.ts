import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from '@prismaConfig/@generated/user/user.model';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import {
  OnlyAdminAllowed,
  OnlySameUserByIdAllowed,
} from '@/auth/interceptors/user.interceptor';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly service: UserService) {}

  @Query(() => [User], { name: 'users', complexity: 5 })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OnlyAdminAllowed)
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OnlyAdminAllowed)
  @Query(() => User, { name: 'user', complexity: 5 })
  findOne(@Args('id', { type: () => String }) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OnlySameUserByIdAllowed || OnlyAdminAllowed)
  removeUser(@Args('id', { type: () => String }) id: number) {
    return this.service.remove(id);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OnlySameUserByIdAllowed || OnlyAdminAllowed)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserDTO,
  ): Promise<User> {
    return this.service.update(updateUserInput.id, updateUserInput);
  }
}
