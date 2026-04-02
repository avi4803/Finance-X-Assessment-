import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalLimiter } from './middlewares/rateLimit.middleware';
import healthRoutes from './routes/health.routes';
import apiRoutes from './routes';
import { globalErrorHandler } from './middlewares/globalErrorHandler';

const app = express();

// Setting up the security and parsing plumbing
app.use(helmet());            
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Dynamic Whitelist
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));              
app.use(express.json());      
app.use(morgan('dev'));       

// Health route sits above the limiter so monitoring tools don't get blocked
app.use('/api/v1/health', healthRoutes);

// Protect everything else under the 5-minute safety window
app.use('/api/v1', globalLimiter);

// The Core API Feature Routes
app.use('/api/v1', apiRoutes);

// Universal fallback to catch those 404s cleanly
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// The central safety net for any unhandled crashes
app.use(globalErrorHandler);

// Boot sequence (Standard for assessments)
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server successfully started on port ${PORT} 🚀`);
  });
}

export default app;
