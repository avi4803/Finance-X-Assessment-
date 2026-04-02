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
const express_1 = require("express");
const authController = __importStar(require("../controllers/auth.controller"));
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_schema_1 = require("../schemas/auth.schema");
const rateLimit_middleware_1 = require("../middlewares/rateLimit.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const success_response_1 = require("../utils/errors/success.response");
const router = (0, express_1.Router)();
// Public Rate-Limited Endpoints
router.post('/register', (0, validate_middleware_1.validate)(auth_schema_1.RegisterSchema), authController.register);
router.post('/login', rateLimit_middleware_1.authLimiter, (0, validate_middleware_1.validate)(auth_schema_1.LoginSchema), authController.login);
// Protected Endpoint
router.get('/me', auth_middleware_1.authenticate, (req, res) => {
    // Returns current user profile (password is already omitted via typing/middleware extraction ideally, 
    // but let's safely omit it here).
    const { password, ...safeUser } = req.user;
    (0, success_response_1.sendSuccess)(res, safeUser, 'Profile fetched successfully', 200);
});
exports.default = router;
