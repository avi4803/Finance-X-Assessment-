/**
 * Financial Calculation Logic
 * Dedicated utility for high-precision arithmetic balance tracking.
 */
export const calculateNetBalance = (transactions: { amount: number; type: string }[]): number => {
  return transactions.reduce((acc, current) => {
    return current.type === 'INCOME' ? acc + current.amount : acc - current.amount;
  }, 0);
};

export const aggregateByCategory = (transactions: { amount: number; category: string }[]) => {
  return transactions.reduce((acc: any, current) => {
    acc[current.category] = (acc[current.category] || 0) + current.amount;
    return acc;
  }, {});
};
