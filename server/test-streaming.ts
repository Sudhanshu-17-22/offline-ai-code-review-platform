import { io } from "socket.io-client";
import jwt from "jsonwebtoken";
import { env } from "./src/config/env";

const testToken = jwt.sign(
    { id: "test-user-123", email: "test@example.com" },
    env.JWT_SECRET,
    { expiresIn: "1h" }
);

const socket = io("http://localhost:5000", {
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
    console.log(
        `  - Score: ${data.staticAnalysis.score}/100`
    );
    console.log(
        `  - Issues: ${data.staticAnalysis.findings.length}`
    );
    console.log(
        `  - Complexity: ${data.staticAnalysis.metrics.cyclomaticComplexity}\n`
    );
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






