import { describe, it, expect } from 'vitest';
import { calculateNetBalance, aggregateByCategory } from '../utils/math';

describe('Financial Math Utility', () => {
  it('should correctly calculate net balance from multiple transaction types', () => {
    const transactions = [
      { amount: 1000, type: 'INCOME' },
      { amount: 200, type: 'EXPENSE' },
      { amount: 50, type: 'EXPENSE' },
      { amount: 300, type: 'INCOME' },
    ];
    
    const balance = calculateNetBalance(transactions);
    expect(balance).toBe(1050); // (1000 + 300) - (200 + 50)
  });

  it('should handle category aggregations properly', () => {
    const transactions = [
      { amount: 100, category: 'Food' },
      { amount: 200, category: 'Rent' },
      { amount: 50, category: 'Food' },
    ];
    
    const distribution = aggregateByCategory(transactions);
    expect(distribution.Food).toBe(150);
    expect(distribution.Rent).toBe(200);
  });
});
