import { UserService } from '@services/UserService';
import { NextFunction, Request, Response } from 'express';

export class UserController {
  private userService = new UserService();

  all = async (req: Request, res: Response) => {
    try {
      const resp = await this.userService.getAll();
      res.send(resp);
    } catch (e) {
      res.status(500).send(e);
    }
  };

  one = async (req: Request, res: Response) => {
    try {
      const resp = await this.userService.getByUsername(req.params.username);
      if (resp) return res.json(resp);
      res.sendStatus(404);
    } catch (e) {
      res.status(500).send(e);
    }
  };

  save = async (req: Request, res: Response) => {
    try {
      await this.userService.save(req.body);
      res.sendStatus(200);
    } catch (e) {
      if (e.code == 'ER_DUP_ENTRY')
        return res
          .status(409)
          .send({ message: `Username ${req.body.username} not available` });
      else res.status(400).send(e);
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const resp = await this.userService.remove(req.body);
      if (resp) return res.json(resp);
      res.sendStatus(404);
    } catch (e) {
      res.status(500).send(e);
    }
  };
}

export default UserController;
