import dotenv from 'dotenv';

dotenv.config();
interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  MONGODB_URI: string;
  CLIENT_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: getEnvVar('NODE_ENV'),
  MONGODB_URI: getEnvVar('MONGODB_URI'),
  CLIENT_URL: getEnvVar('CLIENT_URL'),
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnvVar("JWT_EXPIRES_IN"),
};

