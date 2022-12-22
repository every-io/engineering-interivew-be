import { PermissionRoles } from '../../../application/config/roles.config';
import { User } from '../../../domain/entities/user.entity';

export class LoginData {
  public static getMockUsers(): User[] {
    const userHenrique: User = {
        id: 1,
        name: 'Henrique Alves',
        password: 'henriquealves',
        roles: PermissionRoles.ALL,
    }
    
    const userBarry: User = {
        id: 2,
        name: 'Barry Peterson',
        password: 'barrypeterson',
        roles: PermissionRoles.ALL,
    }

    const userRead: User = {
      id: 3,
      name: 'User Read',
      password: 'userread',
      roles: PermissionRoles.TASK_READ,
  }

  const userWrite: User = {
    id: 4,
    name: 'User Write',
    password: 'userwrite',
    roles: PermissionRoles.TASK_WRITE,
}
    
    return [userHenrique, userBarry, userRead, userWrite];
  }

  public static getMySecret(): string {
    return process.env.SECRET!;
  }
}
