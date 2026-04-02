import { prisma } from '../config/prisma';

export const logAction = async (
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE',
  tableName: string,
  recordId: string,
  changedByUserId: string,
  oldData?: any,
  newData?: any
) => {
  // Fire-and-Forget database insertion to not block the main process.
  // In an enterprise app, this might be sent to an SQS Queue or a worker.
  return await prisma.auditLog.create({
    data: {
      action,
      tableName,
      recordId,
      changedByUserId,
      oldData: oldData ? JSON.stringify(oldData) : null,
      newData: newData ? JSON.stringify(newData) : null,
    },
  });
};

export const getAuditLogs = async (query: any) => {
  const { page = 1, limit = 20, tableName, action, recordId } = query;
  
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where: any = {};
  if (tableName) where.tableName = tableName;
  if (action) where.action = action;
  if (recordId) where.recordId = recordId;

  const [logs, totalCount] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take,
      orderBy: { timestamp: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    data: logs,
    pagination: {
      total: totalCount,
      page: Number(page),
      limit: take,
      totalPages: Math.ceil(totalCount / take),
    },
  };
};
