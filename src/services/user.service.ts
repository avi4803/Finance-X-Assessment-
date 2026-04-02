import { prisma } from '../config/prisma';
import { AppError } from '../utils/errors/AppError';

// Administrative User Registry: Provides full visibility for Admins
export const getUsers = async (query: any) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        failedLoginAttempts: true,
        isLocked: true,
      }
    }),
    prisma.user.count()
  ]);

  return {
    data: users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }
  };
};

// Administrative Update: Flip status or roles for any user in the fleet
export const updateUserByAdmin = async (userId: string, body: any) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) throw new AppError('User not found in system', 404);

  // We only allow specific admin-level updates here
  const { role, status, isLocked } = body;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(role && { role }),
      ...(status && { status }),
      ...(isLocked !== undefined && { isLocked })
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    }
  });

  return updatedUser;
};

export const deleteUserByAdmin = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found in system', 404);

  // Note: If you have dependent records (transactions, auditLogs),
  // they should be deleted or the schema needs onDelete: Cascade.
  // Assuming cascade is set, or we delete manually.
  // Actually, let's delete them manually if cascade is not set to be safe.
  await prisma.transaction.deleteMany({ where: { userId } });
  await prisma.auditLog.deleteMany({ where: { changedByUserId: userId } });
  await prisma.user.delete({ where: { id: userId } });

  return null;
};
