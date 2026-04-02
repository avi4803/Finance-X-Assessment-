import jwt, { Secret, SignOptions } from 'jsonwebtoken';

// In production, always ensure JWT_SECRET is set in .env
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'super_secret_fallback_do_not_use_in_prod';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const generateToken = (userId: string, role: string): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as any };
  return jwt.sign({ id: userId, role }, JWT_SECRET, options);
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
