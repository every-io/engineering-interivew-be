import UserController from '@controller/UserController';
import { Router } from 'express';

export const UserRoutes = (): Router => {
  // Get Router
  const router = Router();
  // Add Controller
  const userController = new UserController();
  // Add Routes
  router.get('/users', userController.all);
  router.get('/users/:id', userController.one);
  router.post('/users', userController.save);
  router.delete('/users/:id', userController.remove);

  return router;
};
