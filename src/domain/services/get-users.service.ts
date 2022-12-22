import { Inject } from '@nestjs/common';
import { UserRepositoryInterface } from '../../infrastructure/repositories/interfaces/user-repository.interface';
import { User } from '../entities/user.entity';

export class GetUsersService {
    public constructor(
      @Inject('UserRepositoryInterface')
      private readonly userRepository: UserRepositoryInterface,
    ) {}
  
    public async getAllUsers(): Promise<User[]> {
      return await this.userRepository.getAllUsers();
    }
  }