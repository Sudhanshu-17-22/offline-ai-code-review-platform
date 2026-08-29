import { z } from "zod";
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  CLIENT_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  OLLAMA_BASE_URL: z.string().url().default('http://localhost:11434'),
  OLLAMA_MODEL: z.string().default('qwen2.5-coder:7b'),
  MAX_REVIEWS_PER_HOUR: z.string().default('10'),
  MAX_REVIEWS_PER_DAY: z.string().default('50'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  MONGODB_URI: string;
  CLIENT_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  OLLAMA_BASE_URL: string;
  OLLAMA_MODEL: string;
  MAX_REVIEWS_PER_HOUR: number;
  MAX_REVIEWS_PER_DAY: number;
  LOG_LEVEL: string;
}

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function parseEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('Invalid environment variables:', error);
    process.exit(1);
  }
}

const validatedEnv = parseEnv();

export const env: EnvConfig = {
  PORT: Number(validatedEnv?.PORT) || 5000,
  NODE_ENV: validatedEnv?.NODE_ENV || getEnvVar('NODE_ENV'),
  MONGODB_URI: validatedEnv?.MONGODB_URI || getEnvVar('MONGODB_URI'),
  CLIENT_URL: validatedEnv?.CLIENT_URL || getEnvVar('CLIENT_URL'),
  JWT_SECRET: validatedEnv?.JWT_SECRET || getEnvVar('JWT_SECRET'),
  JWT_EXPIRES_IN: validatedEnv?.JWT_EXPIRES_IN || getEnvVar('JWT_EXPIRES_IN'),
  OLLAMA_BASE_URL: validatedEnv?.OLLAMA_BASE_URL || getEnvVar('OLLAMA_BASE_URL'),
  OLLAMA_MODEL: validatedEnv?.OLLAMA_MODEL || getEnvVar('OLLAMA_MODEL'),
  MAX_REVIEWS_PER_HOUR: Number(validatedEnv?.MAX_REVIEWS_PER_HOUR) || 10,
  MAX_REVIEWS_PER_DAY: Number(validatedEnv?.MAX_REVIEWS_PER_DAY) || 50,
  LOG_LEVEL: validatedEnv?.LOG_LEVEL || 'info',
};

export type Env = z.infer<typeof envSchema>;

