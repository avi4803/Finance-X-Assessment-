import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { RegisterSchema, LoginSchema } from '../schemas/auth.schema';
import { authLimiter } from '../middlewares/rateLimit.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { sendSuccess } from '../utils/errors/success.response';

const router = Router();

router.post('/register', validate(RegisterSchema), authController.register);
router.post('/login', authLimiter, validate(LoginSchema), authController.login);

// Protected Endpoint
router.get('/me', authenticate, (req: any, res) => {
  // Returns current user profile (password is already omitted via typing/middleware extraction ideally, 
  // but let's safely omit it here).
  const { password, ...safeUser } = req.user;
  sendSuccess(res, safeUser, 'Profile fetched successfully', 200);
});

export default router;
