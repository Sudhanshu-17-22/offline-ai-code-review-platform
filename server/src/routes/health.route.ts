import { checkAiHealth } from '@/controllers/health.controller';
import { Router } from 'express';
import mongoose from 'mongoose';
import { env } from '@/config/env';

const router = Router();

router.get("/ai", checkAiHealth);

router.get('/health', async (_req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  let ollamaStatus = 'unknown';
  
  try {
    const response = await fetch(`${env.OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(2000),
    });
    ollamaStatus = response.ok ? 'connected' : 'error';
  } 
  catch {
    ollamaStatus = 'unavailable';
  }

  const healthy = dbStatus === 'connected';

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      ollama: ollamaStatus,
    },
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  });
});

router.get('/', (_req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

export default router;

