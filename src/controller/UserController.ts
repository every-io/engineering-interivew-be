import { UserService } from '@services/UserService';
import { NextFunction, Request, Response } from 'express';

export class UserController {
  private userService = new UserService();

  all = async (request: Request, response: Response, next: NextFunction) => {
    response.sendStatus(200);
  }

  one = async (request: Request, response: Response, next: NextFunction) => {
    response.sendStatus(200);
  }

  save = async (request: Request, response: Response, next: NextFunction) => {
    response.sendStatus(200);
  }

  remove = async (request: Request, response: Response, next: NextFunction) => {
    response.sendStatus(200);
  }
}

export default UserController;
