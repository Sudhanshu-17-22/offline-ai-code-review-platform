import { aiService } from "@/services/ai.service";
import { ollamaService } from "@/services/ollama.service";
import { SupportedLanguage } from "@/types";
import { logger } from "@/utils/logger";

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

const runTest = async (): Promise<void> => {
    logger.info("🔍 Checking Ollama connection...");
    const isHealthy = await ollamaService.healthCheck();

    if (!isHealthy) {
        logger.error(
        "❌ Cannot reach Ollama. Make sure it's running (check system tray icon or run 'ollama serve')."
        );
        process.exit(1);
    }
    logger.info("✅ Ollama is reachable");

    logger.info("🤖 Sending sample buggy code for AI review...");
    logger.info("⏳ This may take 10-60 seconds depending on your hardware...");

    const startTime = Date.now();
    const result = await aiService.reviewCode(
        sampleBuggyCode,
        SupportedLanguage.JAVASCRIPT
    );
    const duration = Date.now() - startTime;

    logger.info(`✅ AI review completed in ${duration}ms`);
    logger.info(`📊 Overall Score: ${result.overallScore}/100`);
    logger.info(`📝 Summary: ${result.summary}`);
    logger.info(`🐛 Issues found: ${result.issues.length}`);

    result.issues.forEach((issue, index) => {
        logger.info(
        `\n  ${index + 1}. [${issue.severity.toUpperCase()}] Line ${issue.line}: ${issue.title}`
        );
        logger.info(`     ${issue.description}`);
        if (issue.suggestion) {
        logger.info(`     💡 Suggestion: ${issue.suggestion}`);
        }
    });
    process.exit(0);
};
runTest().catch((error) => {
    logger.error(`Test failed: ${(error as Error).message}`);
    process.exit(1);
});







