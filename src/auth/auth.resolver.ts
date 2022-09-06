import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '@prismaConfig/@generated/user/user.model';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '@user/dtos/create-user.dto';
import { LoginRequestDTO } from './dtos/login-request.dto';
import { LoginResponseDTO } from './dtos/login-response.dto';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponseDTO)
  @UseGuards(GqlAuthGuard)
  login(@Args('loginRequestInput') loginRequestInput: LoginRequestDTO) {
    return this.authService.login();
  }

  @Mutation(() => User)
  signUp(@Args('createUserInput') createUserInput: CreateUserDTO) {
    return this.authService.signup(createUserInput);
  }
}
