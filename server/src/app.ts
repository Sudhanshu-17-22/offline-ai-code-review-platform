import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { errorHandler, notFoundHandler } from "@/middlewares/errorHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import authRoutes from "@/routes/auth.route"; 
import healthRoute from "@/routes/health.route";
import reviewRoutes from "@/routes/review.route";
import analyticsRoutes from "./routes/analytics.routes";
import { addRequestId } from "@/middlewares/errorHandler";
import { globalRateLimiter } from "@/middlewares/rate.limit.middleware";
import {
  sanitizeBodyMiddleware,
  sanitizeQueryMiddleware,
} from "@/middlewares/sanitize.middleware";

const app: Application = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ limit: "100kb", extended: true }));
app.use(addRequestId);
app.use(globalRateLimiter(60000, 100));
app.use(sanitizeBodyMiddleware);
app.use(sanitizeQueryMiddleware);
app.use(
  morgan("dev", {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

app.get("/api/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json(new ApiResponse("Server is running fine 🚀", { uptime: process.uptime() }));
});

app.use("/api/auth", authRoutes); 
app.use("/api/health", healthRoute);
app.use("/api/reviews", reviewRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
