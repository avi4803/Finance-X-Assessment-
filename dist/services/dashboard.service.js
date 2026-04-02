"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticsSummary = void 0;
const prisma_1 = require("../config/prisma");
const getAnalyticsSummary = async (query) => {
    const { startDate, endDate } = query;
    // Base scope for analytics (ignore soft-deleted records)
    const where = { deletedAt: null };
    if (startDate || endDate) {
        where.date = {};
        if (startDate)
            where.date.gte = new Date(startDate);
        if (endDate)
            where.date.lte = new Date(endDate);
    }
    // 1. Calculate Summary: Total Income & Total Expense directly via SQL GROUP BY capabilities
    const aggregations = await prisma_1.prisma.transaction.groupBy({
        by: ['type'],
        where,
        _sum: { amount: true },
    });
    const totalIncome = aggregations.find(a => a.type === 'INCOME')?._sum.amount || 0;
    const totalExpense = aggregations.find(a => a.type === 'EXPENSE')?._sum.amount || 0;
    const netBalance = totalIncome - totalExpense;
    // 2. Category Distribution: Essential for modern Pie Charts
    const categoryDistribution = await prisma_1.prisma.transaction.groupBy({
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
    const recentTransactions = await prisma_1.prisma.transaction.findMany({
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
exports.getAnalyticsSummary = getAnalyticsSummary;
