import { z } from "zod";
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    PORT: z.ZodDefault<z.ZodString>;
    MONGODB_URI: z.ZodString;
    CLIENT_URL: z.ZodString;
    JWT_SECRET: z.ZodString;
    JWT_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    OLLAMA_BASE_URL: z.ZodDefault<z.ZodString>;
    OLLAMA_MODEL: z.ZodDefault<z.ZodString>;
    MAX_REVIEWS_PER_HOUR: z.ZodDefault<z.ZodString>;
    MAX_REVIEWS_PER_DAY: z.ZodDefault<z.ZodString>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<{
        error: "error";
        warn: "warn";
        info: "info";
        debug: "debug";
    }>>;
}, z.core.$strip>;
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
export declare const env: EnvConfig;
export type Env = z.infer<typeof envSchema>;
export {};
//# sourceMappingURL=env.d.ts.map