"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.loginUser = exports.registerUser = void 0;
const models_1 = require("@/models");
const jwt_1 = require("@/utils/jwt");
const ApiError_1 = require("@/utils/ApiError");
const ApiResponse_1 = require("@/utils/ApiResponse");
const async_handler_1 = require("@/utils/async.handler");
exports.registerUser = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await models_1.User.findOne({ email });
    if (existingUser) {
        throw new ApiError_1.ApiError(409, "An account with this email already exists");
    }
    const user = await models_1.User.create({ name, email, password });
    const token = (0, jwt_1.generateToken)(user._id.toString());
    res.status(201).json(new ApiResponse_1.ApiResponse("Account created successfully", {
        user,
        token,
    }));
});
exports.loginUser = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await models_1.User.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError_1.ApiError(401, "Invalid email or password");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new ApiError_1.ApiError(401, "Invalid email or password");
    }
    const token = (0, jwt_1.generateToken)(user._id.toString());
    res.status(200).json(new ApiResponse_1.ApiResponse("Login successful", {
        user,
        token,
    }));
});
exports.getCurrentUser = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const user = await models_1.User.findById(req.userId);
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse("User fetched successfully", { user }));
});
//# sourceMappingURL=auth.controller.js.map