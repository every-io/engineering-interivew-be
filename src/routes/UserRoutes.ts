import UserController from '@controller/UserController';
import { Router } from 'express';
import { addSchema, validate } from '@middlewares/valid';
import { authenticate } from '@middlewares/auth';
import userDto from '@dto/userDto';
import { Role } from '@entity/Roles';

export const UserRoutes = (): Router => {
  // Get Router
  const router = Router();
  // Add Controller
  const userController = new UserController();
  // Get all or some user
  router.get('/users/:username', authenticate([Role.Admin]), userController.one);
  router.get('/users', authenticate([Role.Admin]), userController.all);
  // Create User
  addSchema(userDto, 'createUser');
  router.post('/users', validate('createUser'), userController.save);

  // Delte User
  router.delete('/users/:id', authenticate([Role.Admin]), userController.remove);

  return router;
};
