import { Schema, model } from "mongoose";
import { IProject, SupportedLanguage } from "@/types";

const projectFileSchema = new Schema(
  {
    fileName: { type: String, required: true },
    content: { type: String, required: true },
    language: {
      type: String,
      enum: Object.values(SupportedLanguage),
      required: true,
    },
  },
  { _id: false }
);

const projectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
        validator: (files: unknown[]) => files.length <= 20,
        message: "A project cannot contain more than 20 files",
      },
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ userId: 1, createdAt: -1 });

export const Project = model<IProject>("Project", projectSchema);

