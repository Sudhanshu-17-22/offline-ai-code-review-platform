import { Request, Response } from "express";
import { User } from "@/models";
import { generateToken } from "@/utils/jwt";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/async.handler";
import { RegisterInput, LoginInput } from "@/utils/validators/auth.validator";

export const registerUser = asyncHandler(
  async (req: Request<{}, {}, RegisterInput>, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists");
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id.toString());

    res.status(201).json(
      new ApiResponse("Account created successfully", {
        user,
        token,
      })
    );
  }
);

export const loginUser = asyncHandler(
  async (req: Request<{}, {}, LoginInput>, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = generateToken(user._id.toString());

    res.status(200).json(
      new ApiResponse("Login successful", {
        user,
        token,
      })
    );
  }
);

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse("User fetched successfully", { user }));
  }
);


