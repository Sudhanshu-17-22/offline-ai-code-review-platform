import nextJest from "next/jest.js";

const createJestConfig = nextJest({
        dir: "./",
});
const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    testEnvironment: "jest-environment-jsdom",
    testMatch: [
        "**/tests/**/*.test.ts",
        "**/tests/**/*.test.tsx",
        "**/*.test.ts",
        "**/*.test.tsx",
    ],
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/*.d.ts",
        "!src/**/*.stories.tsx",
        "!src/app/**",
    ],
};

export default createJestConfig(customJestConfig);




