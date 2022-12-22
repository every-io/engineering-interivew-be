import { User } from '../../domain/entities/user.entity';
import { UserRepositoryInterface } from './interfaces/user-repository.interface';
import { LoginData } from './mocks/login-data';

const allUsers = LoginData.getMockUsers();

export class UserRepository implements UserRepositoryInterface {
    public async getAllUsers(): Promise<User[]> {
        return allUsers;
    }
}