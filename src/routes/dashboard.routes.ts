import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Secure the aggregated data endpoints
router.use(authenticate);

router.get('/analytics', dashboardController.getAnalytics);

router.get('/trends', dashboardController.getTrends);

export default router;
