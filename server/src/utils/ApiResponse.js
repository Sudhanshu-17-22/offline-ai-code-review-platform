"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    success;
    message;
    data;
    timestamp;
    constructor(message, data) {
        this.success = true;
        this.message = message;
        this.data = data;
        this.timestamp = new Date().toISOString();
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map