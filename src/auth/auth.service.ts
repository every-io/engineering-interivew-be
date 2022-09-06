import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prismaConfig/@generated/user/user.model';
import { UserService } from '@user/user.service';
import { CreateUserDTO } from '@user/dtos/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginResponseDTO } from './dtos/login-response.dto';
import { CONTEXT } from '@nestjs/graphql';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CONTEXT) private context,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(): Promise<LoginResponseDTO> {
    return {
      access_token: this.jwtService.sign({
        email: this.context.req.user.email,
        sub: this.context.req.user.id,
        name: this.context.req.user.name,
        isAdmin: this.context.req.user.isAdmin,
      }),
      user: this.context.req.user,
    };
  }

  async signup(createUser: CreateUserDTO): Promise<User> {
    const user = await this.userService.findByEmail(createUser.email);

    if (user) {
      throw new ConflictException('User already exists!');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUser.password, salt);

    return this.userService.create({ ...createUser, password: hashedPassword });
  }
}
