"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const math_1 = require("../utils/math");
(0, vitest_1.describe)('Financial Math Utility', () => {
    (0, vitest_1.it)('should correctly calculate net balance from multiple transaction types', () => {
        const transactions = [
            { amount: 1000, type: 'INCOME' },
            { amount: 200, type: 'EXPENSE' },
            { amount: 50, type: 'EXPENSE' },
            { amount: 300, type: 'INCOME' },
        ];
        const balance = (0, math_1.calculateNetBalance)(transactions);
        (0, vitest_1.expect)(balance).toBe(1050); // (1000 + 300) - (200 + 50)
    });
    (0, vitest_1.it)('should handle category aggregations properly', () => {
        const transactions = [
            { amount: 100, category: 'Food' },
            { amount: 200, category: 'Rent' },
            { amount: 50, category: 'Food' },
        ];
        const distribution = (0, math_1.aggregateByCategory)(transactions);
        (0, vitest_1.expect)(distribution.Food).toBe(150);
        (0, vitest_1.expect)(distribution.Rent).toBe(200);
    });
});
