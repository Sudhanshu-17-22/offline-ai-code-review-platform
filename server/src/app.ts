import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check route (confirms server is alive)
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running fine 🚀",
  });
});

export default app;