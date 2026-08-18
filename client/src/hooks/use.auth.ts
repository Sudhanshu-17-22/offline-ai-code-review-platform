"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { AuthStore } from "@/store/auth.store";
import { registerUser, loginUser } from "@/libraries/auth";
import { RegisterFormData, LoginFormData } from "@/types";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setAuth, clearAuth } = AuthStore();

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const result = await registerUser(data);
      setAuth(result.user, result.token);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await loginUser(data);
      setAuth(result.user, result.token);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return { register, login, logout, isLoading };
};



