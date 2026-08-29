import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { initReviewSocket } from "./sockets/review.socket";
import { logger } from "./utils/logger";
import mongoose from "mongoose";

const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
  pingInterval: 25000,
  pingTimeout: 60000,
});

initReviewSocket(io);

app.locals.io = io;

const startServer = async () => {
  try {
    await connectDB();

    logger.info('✅ MongoDB connected successfully');

    httpServer.listen(env.PORT, '0.0.0.0', () => {
      logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
      logger.info(`🔌 Socket.io enabled`);
      logger.info(`🌱 Environment: ${env.PORT}`);
    });
  } catch (error) {
    logger.info('❌ Failed to start server:', error);
    process.exit(1);
  }
};
const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  httpServer.close(async () => {
    logger.info('HTTP server closed');
    io.close();
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
    process.exit(0);
  });
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer();

export default httpServer;

