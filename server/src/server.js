"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const review_socket_1 = require("./sockets/review.socket");
const logger_1 = require("./utils/logger");
const mongoose_1 = __importDefault(require("mongoose"));
const httpServer = (0, http_1.createServer)(app_1.default);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: env_1.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
    pingInterval: 25000,
    pingTimeout: 60000,
});
(0, review_socket_1.initReviewSocket)(io);
app_1.default.locals.io = io;
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        logger_1.logger.info('✅ MongoDB connected successfully');
        httpServer.listen(env_1.env.PORT, '0.0.0.0', () => {
            logger_1.logger.info(`🚀 Server running on http://localhost:${env_1.env.PORT}`);
            logger_1.logger.info(`🔌 Socket.io enabled`);
            logger_1.logger.info(`🌱 Environment: ${env_1.env.PORT}`);
        });
    }
    catch (error) {
        logger_1.logger.info('❌ Failed to start server:', error);
        process.exit(1);
    }
};
const shutdown = async (signal) => {
    logger_1.logger.info(`${signal} received. Shutting down gracefully...`);
    httpServer.close(async () => {
        logger_1.logger.info('HTTP server closed');
        io.close();
        await mongoose_1.default.connection.close();
        logger_1.logger.info('MongoDB connection closed');
        process.exit(0);
    });
    setTimeout(() => {
        logger_1.logger.error('Forced shutdown due to timeout');
        process.exit(1);
    }, 10000);
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
startServer();
exports.default = httpServer;
//# sourceMappingURL=server.js.map