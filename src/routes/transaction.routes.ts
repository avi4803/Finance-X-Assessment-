import { Router } from 'express';
import * as transactionController from '../controllers/transaction.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import {
  CreateTransactionSchema,
  UpdateTransactionSchema,
  GetTransactionSchema,
} from '../schemas/transaction.schema';

const router = Router();

// Protect ALL transaction routes with Bearer Token JWT
router.use(authenticate);

router.get('/', transactionController.getAll);

router.post(
  '/', 
  authorizeRoles('ADMIN', 'ANALYST'), 
  validate(CreateTransactionSchema), 
  transactionController.create
);

router.get('/:id', validate(GetTransactionSchema), transactionController.getById);

router.put(
  '/:id', 
  authorizeRoles('ADMIN', 'ANALYST'), 
  validate(UpdateTransactionSchema), 
  transactionController.update
);

router.delete(
  '/:id', 
  authorizeRoles('ADMIN'), 
  validate(GetTransactionSchema), 
  transactionController.remove
);

export default router;
