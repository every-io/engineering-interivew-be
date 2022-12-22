import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { LoginData } from '../../infrastructure/repositories/mocks/login-data';
import { PermissionRoles } from '../config/roles.config';

@Injectable()
export class TaskGuard implements CanActivate {
  public constructor() {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token: string = request.headers['x-access-token'];

    if (!token) {
      return false;
    }

    const data: any = jwt.verify(token, LoginData.getMySecret());

    if (data.roles == PermissionRoles.ALL) {
        return true;
    } else if (data.roles == PermissionRoles.TASK_READ) {
        return request.method == 'GET';
    } else {
        return request.method == 'POST' || request.method == 'PUT';
    }
  }
}
