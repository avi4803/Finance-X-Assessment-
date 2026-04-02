"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const error_response_1 = require("../utils/errors/error.response");
const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const message = error.errors.map((e) => `${e.path.join('.').replace('body.', '')}: ${e.message}`).join(', ');
            return (0, error_response_1.sendError)(res, `Validation error: ${message}`, 400);
        }
        return (0, error_response_1.sendError)(res, 'Internal validation error', 500);
    }
};
exports.validate = validate;
