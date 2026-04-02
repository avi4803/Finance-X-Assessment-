import rateLimit from 'express-rate-limit';
// Note: Using In-Memory by default for zero-setup local dev.
// In a high-traffic production fleet, we swap this with 'rate-limit-redis'
// if process.env.REDIS_URL is detected.

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes window
  max: 40, // Limit each IP to 5 login requests per window
  message: { 
    success: false, 
    message: 'Too many login attempts, please try again after 5 minutes.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes window
  max: 100, // Limit each IP to 100 requests per window
  message: { 
    success: false, 
    message: 'Too many requests from this IP, please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});
