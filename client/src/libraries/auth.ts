import api from "@/libraries/api";
import { RegisterFormData, LoginFormData, AuthResponse, ApiResponse } from "@/types";

export const registerUser = async (
  data: RegisterFormData
): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    data
  );
  return response.data.data as AuthResponse;
};

export const loginUser = async (data: LoginFormData): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
  return response.data.data as AuthResponse;
};

export const getCurrentUser = async (): Promise<AuthResponse["user"]> => {
  const response = await api.get<ApiResponse<{ user: AuthResponse["user"] }>>(
    "/auth/me"
  );
  return response.data.data!.user;
};





