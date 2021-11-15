import { User } from '@entity/User';
import { getRepository } from 'typeorm';

export class UserService {
  private userRepository = getRepository(User);

  getAll = async () => {
    return this.userRepository.find();
  };

  getById = async (id?: string) => {
    return this.userRepository.findOne(id);
  };

  getByUsername = (username: string) => {
    return this.userRepository.findOne({ username });
  };

  getLogin = (username: string) => {
    return this.userRepository.findOne(
      { username },
      { select: ['id', 'username', 'password', 'roles'] }
    );
  };

  save = async (body: User) => {
    const user = this.userRepository.create(body);
    return this.userRepository.save(user);
  };

  remove = async (user: User) => {
    return this.userRepository.remove(user);
  };
}
