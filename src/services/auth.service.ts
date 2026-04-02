import { prisma } from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/errors/AppError';

// Bruteforce Config: 20 tries is high enough for typos but blocks pure scripts
const MAX_LOGIN_ATTEMPTS = 20;
const LOCKOUT_MINUTES = 5;

// Handle new user onboarding and return a starting JWT
export const registerUser = async (data: any) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  
  if (existingUser) {
    throw new AppError('Email is already commonly used', 400);
  }

  const hashedPassword = await hashPassword(data.password);
  
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      role: data.role || 'VIEWER' // Default as requested in design
    }
  });

  const token = generateToken(user.id, user.role);
  
  // Omit password from output for security
  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const loginUser = async (data: any) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // 1. Check if the account is administratively locked or temporarily rate-limited
  if (user.isLocked) {
     throw new AppError('Account has been locked by Administrator.', 403);
  }

  if (user.lockoutUntil && user.lockoutUntil > new Date()) {
    throw new AppError(`Account is temporarily locked. Please try again after 5 minutes.`, 403);
  }

  // 2. Validate password
  const isPasswordValid = await comparePassword(data.password, user.password);
  
  if (!isPasswordValid) {
    // Brute Force Guard: Track failures in DB and lock if thresholds are hit
    const attempts = user.failedLoginAttempts + 1;
    const updates: any = { failedLoginAttempts: attempts };
    
    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      const lockoutDate = new Date();
      lockoutDate.setMinutes(lockoutDate.getMinutes() + LOCKOUT_MINUTES);
      updates.lockoutUntil = lockoutDate;
    }
    
    await prisma.user.update({
      where: { id: user.id },
      data: updates
    });
    
    throw new AppError('Invalid email or password', 401);
  }

  // 4. Login Successful: Reset counters
  if (user.failedLoginAttempts > 0 || user.lockoutUntil !== null) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockoutUntil: null,
      }
    });
  }

  const token = generateToken(user.id, user.role);
  const { password, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword, token };
};
