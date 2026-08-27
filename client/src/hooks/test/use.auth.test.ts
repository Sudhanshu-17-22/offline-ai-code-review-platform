import { renderHook, act } from "@testing-library/react";
import { useAuth } from "../use.auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthStore } from "@/store/auth.store";
import { registerUser, loginUser } from "@/libraries/auth";

jest.mock("next/navigation");
jest.mock("react-hot-toast");
jest.mock("@/store/auth.store");
jest.mock("@/libraries/auth");

describe("useAuth Hook", () => {
    const mockPush = jest.fn();
    const mockSetAuth = jest.fn();
    const mockClearAuth = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useRouter as jest.Mock).mockReturnValue({
        push: mockPush,
        });

        (AuthStore as unknown as jest.Mock).mockReturnValue({
        setAuth: mockSetAuth,
        clearAuth: mockClearAuth,
        });
    });

    it("should return initial loading state", () => {
        const { result } = renderHook(() => useAuth());

        expect(result.current.isLoading).toBe(false);
        expect(typeof result.current.register).toBe("function");
        expect(typeof result.current.login).toBe("function");
        expect(typeof result.current.logout).toBe("function");
    });
    it("should register successfully", async () => {
        const mockResponse = {
        user: {
            id: "1",
            email: "test@example.com",
        },
        token: "jwt-token",
        };

        (registerUser as jest.Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useAuth());

        const data = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        };

        await act(async () => {
        await result.current.register(data);
        });

        expect(registerUser).toHaveBeenCalledWith(data);
        expect(mockSetAuth).toHaveBeenCalledWith(
        mockResponse.user,
        mockResponse.token
        );
        expect(toast.success).toHaveBeenCalledWith(
        "Account created successfully!"
        );
        expect(mockPush).toHaveBeenCalledWith("/dashboard");
        expect(result.current.isLoading).toBe(false);
    });
    it("should handle registration errors", async () => {
        (registerUser as jest.Mock).mockRejectedValue(
        new Error("Registration failed")
        );

        const { result } = renderHook(() => useAuth());

        const data = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        };

        await act(async () => {
        await result.current.register(data);
        });

        expect(toast.error).toHaveBeenCalledWith("Registration failed");
        expect(mockSetAuth).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
        expect(result.current.isLoading).toBe(false);
    });
    it("should login successfully", async () => {
        const mockResponse = {
        user: {
            id: "1",
            email: "test@example.com",
        },
        token: "jwt-token",
        };

        (loginUser as jest.Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useAuth());

        const data = {
        email: "test@example.com",
        password: "password123",
        };

        await act(async () => {
        await result.current.login(data);
        });

        expect(loginUser).toHaveBeenCalledWith(data);
        expect(mockSetAuth).toHaveBeenCalledWith(
        mockResponse.user,
        mockResponse.token
        );
        expect(toast.success).toHaveBeenCalledWith("Welcome back!");
        expect(mockPush).toHaveBeenCalledWith("/dashboard");
        expect(result.current.isLoading).toBe(false);
    });
    it("should handle login errors", async () => {
        (loginUser as jest.Mock).mockRejectedValue(
        new Error("Invalid credentials")
        );

        const { result } = renderHook(() => useAuth());

        const data = {
        email: "wrong@example.com",
        password: "wrongpassword",
        };

        await act(async () => {
        await result.current.login(data);
        });

        expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
        expect(mockSetAuth).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
        expect(result.current.isLoading).toBe(false);
    });
    it("should logout successfully", () => {
        const { result } = renderHook(() => useAuth());

        act(() => {
        result.current.logout();
        });

        expect(mockClearAuth).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith(
        "Logged out successfully"
        );
        expect(mockPush).toHaveBeenCalledWith("/");
    });
});







