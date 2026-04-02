"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateByCategory = exports.calculateNetBalance = void 0;
/**
 * Financial Calculation Logic
 * Dedicated utility for high-precision arithmetic balance tracking.
 */
const calculateNetBalance = (transactions) => {
    return transactions.reduce((acc, current) => {
        return current.type === 'INCOME' ? acc + current.amount : acc - current.amount;
    }, 0);
};
exports.calculateNetBalance = calculateNetBalance;
const aggregateByCategory = (transactions) => {
    return transactions.reduce((acc, current) => {
        acc[current.category] = (acc[current.category] || 0) + current.amount;
        return acc;
    }, {});
};
exports.aggregateByCategory = aggregateByCategory;
