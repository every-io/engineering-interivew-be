import { User } from '../../../domain/entities/user.entity';

export interface UserRepositoryInterface {
    getAllUsers(): Promise<User[]>;
  }