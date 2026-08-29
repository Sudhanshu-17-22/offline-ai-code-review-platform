"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jwt_1 = require("@/utils/jwt");
const ApiError_1 = require("@/utils/ApiError");
const async_handler_1 = require("@/utils/async.handler");
const models_1 = require("@/models");
exports.protect = (0, async_handler_1.asyncHandler)(async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError_1.ApiError(401, "Not authorized. No token provided.");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new ApiError_1.ApiError(401, "Not authorized. No token provided.");
    }
    let decoded;
    try {
        decoded = (0, jwt_1.verifyToken)(token);
    }
    catch {
        throw new ApiError_1.ApiError(401, "Not authorized. Invalid or expired token.");
    }
    const userExists = await models_1.User.findById(decoded.userId);
    if (!userExists) {
        throw new ApiError_1.ApiError(401, "Not authorized. User no longer exists.");
    }
    req.userId = decoded.userId;
    next();
});
//# sourceMappingURL=auth.middleware.js.map