import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { initReviewSocket } from "./sockets/review.socket";
import { logger } from "./utils/logger";

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

    console.log('✅ MongoDB connected successfully');

    httpServer.listen(env.PORT, 'localhost', () => {
      console.log(`🚀 Server running on http://localhost:${env.PORT}`);
      console.log(`🔌 Socket.io enabled`);
      console.log(`🌱 Environment: ${env.PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

process.on("SIGINT", () => {
  console.log("🛑 Shutting down gracefully...");

  httpServer.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

startServer();

export default httpServer;

