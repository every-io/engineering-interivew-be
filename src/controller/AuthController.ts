import { User } from '@entity/User';
import { UserService } from '@services/UserService';
import { compareSync } from 'bcrypt';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

export class AuthController {
  private userService = new UserService();

  login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user: User = await this.userService.getLogin(username);

    if (!user) return res.sendStatus(401);

    if (compareSync(password, user.password)) {
      const access_token = sign(
        { id: user.id, roles: user.roles },
        process.env.JWT_SECRET,
        {
          expiresIn: 300,
        }
      );
      res.json({ access_token });
    } else {
      res.status(403).send({ message: 'Invalid username or password' });
    }
  };

  profile = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.getById(res.locals.user.id);
      res.json(user);
    } catch (e) {
      res.status(500).send(e);
    }
  }
}
