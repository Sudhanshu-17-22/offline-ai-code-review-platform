import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { errorHandler, notFoundHandler } from "@/middlewares/errorHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import authRoutes from "@/routes/auth.route"; 

const app: Application = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
