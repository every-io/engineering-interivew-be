import { AuthController } from '@controller/AuthController';
import { Router } from 'express';

export const AuthRoutes = (): Router => {
  // Create Controller
  const authController = new AuthController();
  // Get Router
  const router = Router();
  //Add Routes
  router.post('/login', authController.login);
  return router;
};
