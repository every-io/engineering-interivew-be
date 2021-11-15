import { AuthController } from '@controller/AuthController';
import { Router } from 'express';
import { addSchema, validate } from '@middlewares/valid';
import loginDto from '@dto/loginDto';
import { authenticate } from '@middlewares/auth';
import { Role } from '@entity/Roles';

export const AuthRoutes = (): Router => {
  // Create Controller
  const authController = new AuthController();
  // Get Router
  const router = Router();
  // Login and validation
  addSchema(loginDto, 'login');
  router.post('/login', validate('login'), authController.login);
  // Get Profile
  router.get(
    '/profile',
    authenticate([Role.User]),
    authController.profile
  );
  return router;
};
