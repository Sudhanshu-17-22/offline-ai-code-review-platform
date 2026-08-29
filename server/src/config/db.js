"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const dns_1 = __importDefault(require("dns"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
dns_1.default.setServers(['8.8.8.8']);
async function connectDB() {
    try {
        await mongoose_1.default.connect(env_1.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
    }
    catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
}
mongoose_1.default.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected");
});
mongoose_1.default.connection.on("error", (err) => {
    console.error("MongoDB error:", err);
});
//# sourceMappingURL=db.js.map