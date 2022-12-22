import { Module } from '@nestjs/common';
import { GetUsersService } from '../../domain/services/get-users.service';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { LoginController } from '../controllers/login.controller';

@Module({
  controllers: [LoginController],
  providers: [
    {
        provide: 'UserRepositoryInterface',
        useClass: UserRepository,
    },
    GetUsersService],
})
export class LoginModule {}
