"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const ApiError_1 = require("@/utils/ApiError");
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const message = error.issues.map((e) => e.message).join(", ");
            return next(new ApiError_1.ApiError(400, message));
        }
        next(error);
    }
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map