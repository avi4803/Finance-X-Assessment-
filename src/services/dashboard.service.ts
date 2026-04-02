import { prisma } from '../config/prisma';

export const getAnalyticsSummary = async (query: any) => {
  const { startDate, endDate } = query;

  // Base scope for analytics (ignore soft-deleted records)
  const where: any = { deletedAt: null };
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate as string);
    if (endDate) where.date.lte = new Date(endDate as string);
  }

  // 1. Calculate Summary: Total Income & Total Expense directly via SQL GROUP BY capabilities
  const aggregations = await prisma.transaction.groupBy({
    by: ['type'],
    where,
    _sum: { amount: true },
  });

  const totalIncome = aggregations.find(a => a.type === 'INCOME')?._sum.amount || 0;
  const totalExpense = aggregations.find(a => a.type === 'EXPENSE')?._sum.amount || 0;
  const netBalance = totalIncome - totalExpense;

  // 2. Category Distribution: Essential for modern Pie Charts
  const categoryDistribution = await prisma.transaction.groupBy({
    by: ['category', 'type'],
    where,
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } }, // Sort largest expenses first
  });

  const incomeCategories = categoryDistribution
    .filter(c => c.type === 'INCOME')
    .map(c => ({ category: c.category, amount: c._sum.amount || 0 }));
    
  const expenseCategories = categoryDistribution
    .filter(c => c.type === 'EXPENSE')
    .map(c => ({ category: c.category, amount: c._sum.amount || 0 }));

  // 3. Recents: Helpful for the dashboard "Quick View" component
  const recentTransactions = await prisma.transaction.findMany({
    where,
    take: 5,
    orderBy: { date: 'desc' },
    select: {
      id: true,
      amount: true,
      category: true,
      type: true,
      date: true,
    }
  });

  return {
    summary: {
      netBalance,
      totalIncome,
      totalExpense,
    },
    distribution: {
      income: incomeCategories,
      expense: expenseCategories,
    },
    recentTransactions,
  };
};

// Insight Intelligence: Daily income/expense trends for the last 7 days
export const getTrends = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const transactions = await prisma.transaction.findMany({
    where: {
      date: { gte: sevenDaysAgo },
      deletedAt: null,
    },
    select: {
      amount: true,
      type: true,
      date: true,
    },
    orderBy: { date: 'asc' },
  });

  // Simplified logic for grouping by date (Professional time-series mapping)
  const trends: Record<string, { income: number; expense: number }> = {};

  transactions.forEach((tx) => {
    const dateStr = tx.date.toISOString().split('T')[0];
    if (!trends[dateStr]) trends[dateStr] = { income: 0, expense: 0 };
    
    if (tx.type === 'INCOME') trends[dateStr].income += Number(tx.amount);
    else trends[dateStr].expense += Number(tx.amount);
  });

  return Object.entries(trends).map(([date, data]) => ({
    date,
    ...data,
  }));
};
