"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
describe("Auth Service", () => {
    describe("User Registration", () => {
        it("should create a new user with hashed password", async () => {
            const userData = {
                email: "test@example.com",
                password: "Test@123",
                name: "Test User",
            };
            const user = new user_model_1.User(userData);
            await user.save();
            expect(user.email).toBe(userData.email);
            expect(user.password).not.toBe(userData.password); // Hashed
            expect(user._id).toBeDefined();
        });
        it("should not create duplicate emails", async () => {
            const userData = {
                email: "duplicate@example.com",
                password: "Test@123",
                name: "Test User",
            };
            const user1 = new user_model_1.User(userData);
            await user1.save();
            expect(async () => {
                const user2 = new user_model_1.User(userData);
                await user2.save();
            }).rejects.toThrow();
        });
        it("should validate email format", async () => {
            const user = new user_model_1.User({
                email: "invalid-email",
                password: "Test@123",
                name: "Test",
            });
            expect(async () => {
                await user.save();
            }).rejects.toThrow();
        });
    });
    describe("JWT Token Generation", () => {
        it("should generate valid JWT token", () => {
            const userId = "507f1f77bcf86cd799439011";
            const token = jsonwebtoken_1.default.sign({ id: userId, email: "test@example.com" }, env_1.env.JWT_SECRET, { expiresIn: "7d" });
            expect(token).toBeDefined();
            expect(typeof token).toBe("string");
        });
        it("should decode valid JWT token", () => {
            const payload = { id: "test-id", email: "test@example.com" };
            const token = jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, { expiresIn: "7d" });
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
            expect(decoded.id).toBe(payload.id);
            expect(decoded.email).toBe(payload.email);
        });
        it("should reject expired token", () => {
            const token = jsonwebtoken_1.default.sign({ id: "test-id" }, env_1.env.JWT_SECRET, { expiresIn: "-1d" } // Expired
            );
            expect(() => {
                jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
            }).toThrow();
        });
    });
});
//# sourceMappingURL=auth.service.test.js.map