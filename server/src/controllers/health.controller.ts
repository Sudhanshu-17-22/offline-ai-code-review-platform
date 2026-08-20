import { Request, Response } from "express";
import { ollamaService } from "@/services/ollama.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/async.handler";

export const checkAiHealth = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const isHealthy = await ollamaService.healthCheck();

    res.status(200).json(
      new ApiResponse("AI health check complete", {
        ollamaAvailable: isHealthy,
      })
    );
  }
);







