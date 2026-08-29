"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TEST_DB_URI = process.env.TEST_MONGODB_URI ||
    "mongodb://localhost:27017/code-review-test";
beforeAll(async () => {
    await mongoose_1.default.connect(TEST_DB_URI);
});
afterEach(async () => {
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        await collections[key]?.deleteMany({});
    }
});
afterAll(async () => {
    await mongoose_1.default.disconnect();
});
//# sourceMappingURL=setup.js.map