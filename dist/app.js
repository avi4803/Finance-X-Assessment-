"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const routes_1 = __importDefault(require("./routes"));
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler");
const app = (0, express_1.default)();
// Security and utility Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Documentation - Interactive API UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Core Application Routing (V1)
app.use('/api/v1', routes_1.default);
// 404 Catcher - For unmatched routes
app.use('*', (req, res, next) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});
// The Centralized Global Error Shield
app.use(globalErrorHandler_1.globalErrorHandler);
// Boot sequence (Standard for assessments)
const PORT = process.env.PORT || 5000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server successfully started on port ${PORT} 🚀`);
    });
}
exports.default = app;
