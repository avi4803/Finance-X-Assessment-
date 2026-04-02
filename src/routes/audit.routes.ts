import { Router } from 'express';
import * as auditController from '../controllers/audit.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

const router = Router();

// Strict Security Wrapper
router.use(authenticate);

router.get('/', authorizeRoles('ADMIN'), auditController.getLogs);

export default router;
