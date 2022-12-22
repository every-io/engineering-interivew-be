import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../../domain/dtos/login.dto';
import jwt from 'jsonwebtoken';
import { LoginData } from '../../infrastructure/repositories/mocks/login-data';
import { LoginResponseDto } from '../../domain/dtos/login-response.dto';
import { GetUsersService } from '../../domain/services/get-users.service';

@Controller('/login')
export class LoginController {
  public constructor(private readonly getUsersService: GetUsersService) {}

  @Post()
  public async login(@Body() login?: LoginDto): Promise<LoginResponseDto> {
    if (!login || !login?.name || !login?.password) {
      throw new BadRequestException('Name and Password are required.');
    }

    const allUsers = await this.getUsersService.getAllUsers();
    const user = allUsers.find(user => user.name == login.name && user.password == login.password);

    if (!user) {
      throw new BadRequestException('Invalid login.');
    }

    const token = jwt.sign({ roles: user.roles }, LoginData.getMySecret(), { expiresIn: 600 });
    const loginResponse: LoginResponseDto = {
      token
    };

    return loginResponse;
  }
}
