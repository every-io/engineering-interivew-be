import { Role } from '@entity/Roles';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export const authenticate = (roles?: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // const user =
    const { authorization } = req.headers;

    if (!authorization) return res.sendStatus(403);
    const access_token = authorization.replace('Bearer', '').trim();
    try {
      const user: any = verify(access_token, process.env.JWT_SECRET);
      res.locals.user = user;
      if (roles) {
        if (roles.some((r) => user.roles?.includes(r))) return next();
        // Forbidden
        return res.sendStatus(403);
      }
      // Forbidden
      return next();
    } catch {
      // Forbidden
      return res.sendStatus(403);
    }
  };
};
