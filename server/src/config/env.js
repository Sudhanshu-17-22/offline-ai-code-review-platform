"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('5000'),
    MONGODB_URI: zod_1.z.string().min(1, 'MONGODB_URI is required'),
    CLIENT_URL: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    OLLAMA_BASE_URL: zod_1.z.string().url().default('http://localhost:11434'),
    OLLAMA_MODEL: zod_1.z.string().default('qwen2.5-coder:7b'),
    MAX_REVIEWS_PER_HOUR: zod_1.z.string().default('10'),
    MAX_REVIEWS_PER_DAY: zod_1.z.string().default('50'),
    LOG_LEVEL: zod_1.z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});
function getEnvVar(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}
function parseEnv() {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        console.error('Invalid environment variables:', error);
        process.exit(1);
    }
}
const validatedEnv = parseEnv();
exports.env = {
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
//# sourceMappingURL=env.js.map