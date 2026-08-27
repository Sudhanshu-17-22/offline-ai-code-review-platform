import { User } from "../../models/user.model";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

describe("Auth Service", () => {
    describe("User Registration", () => {
        it("should create a new user with hashed password", async () => {
        const userData = {
            email: "test@example.com",
            password: "Test@123",
            name: "Test User",
        };

        const user = new User(userData);
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

        const user1 = new User(userData);
        await user1.save();

        expect(async () => {
            const user2 = new User(userData);
            await user2.save();
        }).rejects.toThrow();
        });

        it("should validate email format", async () => {
        const user = new User({
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
        const token = jwt.sign(
            { id: userId, email: "test@example.com" },
            env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        expect(token).toBeDefined();
        expect(typeof token).toBe("string");
        });

        it("should decode valid JWT token", () => {
        const payload = { id: "test-id", email: "test@example.com" };
        const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });

        const decoded = jwt.verify(token, env.JWT_SECRET) as typeof payload;

        expect(decoded.id).toBe(payload.id);
        expect(decoded.email).toBe(payload.email);
        });

        it("should reject expired token", () => {
            const token = jwt.sign(
                { id: "test-id" },
                env.JWT_SECRET,
                { expiresIn: "-1d" } // Expired
            );

            expect(() => {
                jwt.verify(token, env.JWT_SECRET);
            }).toThrow();
        });
    });
});




