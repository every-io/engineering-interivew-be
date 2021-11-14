import { User } from '@entity/User';
import { UserService } from '@services/UserService';
import { compareSync } from 'bcrypt';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

export class AuthController {
  private userService = new UserService();

  login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user: User = await this.userService.getByUsername(username);
    if (!user) return res.sendStatus(401);
    if (compareSync(password, user.password)) {
      const token = sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: 300,
      });
      res.json(token);
    }
  }
}
