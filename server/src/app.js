"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("@/config/env");
const logger_1 = require("@/utils/logger");
const errorHandler_1 = require("@/middlewares/errorHandler");
const ApiResponse_1 = require("@/utils/ApiResponse");
const auth_route_1 = __importDefault(require("@/routes/auth.route"));
const health_route_1 = __importDefault(require("@/routes/health.route"));
const review_route_1 = __importDefault(require("@/routes/review.route"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const errorHandler_2 = require("@/middlewares/errorHandler");
const rate_limit_middleware_1 = require("@/middlewares/rate.limit.middleware");
const sanitize_middleware_1 = require("@/middlewares/sanitize.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: env_1.env.CLIENT_URL,
    credentials: true,
}));
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));
app.use(express_1.default.json({ limit: "100kb" }));
app.use(express_1.default.urlencoded({ limit: "100kb", extended: true }));
app.use(errorHandler_2.addRequestId);
app.use((0, rate_limit_middleware_1.globalRateLimiter)(60000, 100));
app.use(sanitize_middleware_1.sanitizeBodyMiddleware);
app.use(sanitize_middleware_1.sanitizeQueryMiddleware);
app.use((0, morgan_1.default)("dev", {
    stream: {
        write: (message) => logger_1.logger.info(message.trim()),
    },
}));
app.get("/api/health", (req, res) => {
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse("Server is running fine 🚀", { uptime: process.uptime() }));
});
app.use("/api/auth", auth_route_1.default);
app.use("/api/health", health_route_1.default);
app.use("/api/reviews", review_route_1.default);
app.use("/api/analytics", analytics_routes_1.default);
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map