import { User } from '@entity/User';
import { getRepository } from 'typeorm';

export class UserService {
  private userRepository = getRepository(User);

  get = async (user: User) => {
    return this.userRepository.find(user);
  }

  getByUsername = (username: string) => {
    return this.userRepository.findOne({ username });
  }

  save = async (user: User) => {
    return this.userRepository.save(user);
  }

  remove = async (user: User) => {
    await this.userRepository.remove(user);
  }
}
