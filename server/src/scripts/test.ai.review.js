"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ai_service_1 = require("@/services/ai.service");
const ollama_service_1 = require("@/services/ollama.service");
const types_1 = require("@/types");
const logger_1 = require("@/utils/logger");
const sampleBuggyCode = `
function calculateDiscount(price, discountPercent) {
  var discount = price * discountPercent / 100
  var finalPrice = price - discount
  console.log("Final price: " + finalPrice)
  return finalPrice
}

function processOrder(items) {
  let total = 0
  for (var i = 0; i <= items.length; i++) {
    total += items[i].price
  }
  return total
}
`;
const runTest = async () => {
    logger_1.logger.info("🔍 Checking Ollama connection...");
    const isHealthy = await ollama_service_1.ollamaService.healthCheck();
    if (!isHealthy) {
        logger_1.logger.error("❌ Cannot reach Ollama. Make sure it's running (check system tray icon or run 'ollama serve').");
        process.exit(1);
    }
    logger_1.logger.info("✅ Ollama is reachable");
    logger_1.logger.info("🤖 Sending sample buggy code for AI review...");
    logger_1.logger.info("⏳ This may take 10-60 seconds depending on your hardware...");
    const startTime = Date.now();
    const result = await ai_service_1.aiService.reviewCode(sampleBuggyCode, types_1.SupportedLanguage.JAVASCRIPT);
    const duration = Date.now() - startTime;
    logger_1.logger.info(`✅ AI review completed in ${duration}ms`);
    logger_1.logger.info(`📊 Overall Score: ${result.overallScore}/100`);
    logger_1.logger.info(`📝 Summary: ${result.summary}`);
    logger_1.logger.info(`🐛 Issues found: ${result.issues.length}`);
    result.issues.forEach((issue, index) => {
        logger_1.logger.info(`\n  ${index + 1}. [${issue.severity.toUpperCase()}] Line ${issue.line}: ${issue.title}`);
        logger_1.logger.info(`     ${issue.description}`);
        if (issue.suggestion) {
            logger_1.logger.info(`     💡 Suggestion: ${issue.suggestion}`);
        }
    });
    process.exit(0);
};
runTest().catch((error) => {
    logger_1.logger.error(`Test failed: ${error.message}`);
    process.exit(1);
});
//# sourceMappingURL=test.ai.review.js.map