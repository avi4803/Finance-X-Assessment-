import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

const router = Router();

// Secure all user management endpoints to ADMIN ONLY
router.use(authenticate, authorizeRoles('ADMIN'));

router.get('/', userController.listUsers);

router.patch('/:id', userController.modifyUser);

export default router;
