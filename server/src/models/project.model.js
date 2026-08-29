"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = require("mongoose");
const types_1 = require("@/types");
const projectFileSchema = new mongoose_1.Schema({
    fileName: { type: String, required: true },
    content: { type: String, required: true },
    language: {
        type: String,
        enum: Object.values(types_1.SupportedLanguage),
        required: true,
    },
}, { _id: false });
const projectSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: [true, "Project name is required"],
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    files: {
        type: [projectFileSchema],
        default: [],
        validate: {
            validator: (files) => files.length <= 20,
            message: "A project cannot contain more than 20 files",
        },
    },
}, {
    timestamps: true,
});
projectSchema.index({ userId: 1, createdAt: -1 });
exports.Project = (0, mongoose_1.model)("Project", projectSchema);
//# sourceMappingURL=project.model.js.map