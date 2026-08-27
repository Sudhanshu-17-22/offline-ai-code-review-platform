module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverage: true,
    roots: ["<rootDir>/src"],
    testMatch: ["**/test/**/*.test.ts"],
    moduleFileExtensions: ["ts", "js"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts",
        "!src/server.ts",
        "!src/app.ts",
        "!src/test/**/*.ts",
        "!src/scripts/**/*.ts",
    ],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
};



