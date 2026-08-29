"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("./src/config/env");
const testToken = jsonwebtoken_1.default.sign({ id: "test-user-123", email: "test@example.com" }, env_1.env.JWT_SECRET, { expiresIn: "1h" });
const socket = (0, socket_io_client_1.io)("http://localhost:5000", {
    auth: {
        token: testToken,
    },
    transports: ["websocket"],
});
socket.on("connect", () => {
    console.log("✓ Connected to server");
    const testCode = `
    function fibonacci(n) {
        if (n <= 1) return n;
        let a = 0, b = 1;
        for (let i = 2; i <= n; i++) {
            let temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }
    `;
    console.log("\n📤 Submitting code for review...\n");
    socket.emit("review:start", {
        code: testCode.trim(),
        language: "javascript",
        fileName: "fibonacci.js",
    });
});
socket.on("review:status", (data) => {
    console.log(`📊 Status: ${data.message} (${data.progress}%)`);
});
socket.on("review:chunk", (data) => {
    process.stdout.write(data.chunk); // Real-time streaming output
});
socket.on("review:static-complete", (data) => {
    console.log("\n\n✓ Static Analysis Complete:");
    console.log(`  - Score: ${data.staticAnalysis.score}/100`);
    console.log(`  - Issues: ${data.staticAnalysis.findings.length}`);
    console.log(`  - Complexity: ${data.staticAnalysis.metrics.cyclomaticComplexity}\n`);
});
socket.on("review:complete", (data) => {
    console.log("\n✓ Review Complete!");
    console.log(`  - Review ID: ${data.reviewId}`);
    console.log(`  - Overall Score: ${data.overallScore}/100`);
    console.log(`  - AI Score: ${data.aiScore}`);
    console.log(`  - Static Score: ${data.staticScore}`);
    socket.disconnect();
    process.exit(0);
});
socket.on("review:error", (data) => {
    console.error("\n✗ Error:", data.message);
    socket.disconnect();
    process.exit(1);
});
socket.on("disconnect", () => {
    console.log("Disconnected from server");
});
socket.on("connect_error", (error) => {
    console.error("Connection error:", error);
    process.exit(1);
});
//# sourceMappingURL=test-streaming.js.map