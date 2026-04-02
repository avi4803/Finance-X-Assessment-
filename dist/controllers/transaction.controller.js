"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getById = exports.getAll = exports.create = void 0;
const transactionService = __importStar(require("../services/transaction.service"));
const success_response_1 = require("../utils/errors/success.response");
const create = async (req, res, next) => {
    try {
        const userId = req.user.id; // From Auth Middleware
        const transaction = await transactionService.createTransaction(userId, req.body);
        return (0, success_response_1.sendSuccess)(res, transaction, 'Transaction created successfully', 201);
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const getAll = async (req, res, next) => {
    try {
        const result = await transactionService.getTransactions(req.query);
        return (0, success_response_1.sendSuccess)(res, result.data, 'Transactions retrieved successfully', 200, result.pagination);
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const transaction = await transactionService.getTransactionById(req.params.id);
        return (0, success_response_1.sendSuccess)(res, transaction, 'Transaction retrieved successfully', 200);
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
const update = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const transaction = await transactionService.updateTransaction(req.params.id, req.body, userId);
        return (0, success_response_1.sendSuccess)(res, transaction, 'Transaction updated successfully', 200);
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await transactionService.deleteTransaction(req.params.id, userId);
        return (0, success_response_1.sendSuccess)(res, null, 'Transaction deleted successfully (Soft Data Retention)', 200);
    }
    catch (error) {
        next(error);
    }
};
exports.remove = remove;
