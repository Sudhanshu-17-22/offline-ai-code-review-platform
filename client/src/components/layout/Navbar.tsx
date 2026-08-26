"use client";

import { useRouter } from "next/navigation";
import { AuthStore } from "@/store/auth.store";
import { LogOut, BarChart3, History, Plus, Code } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { user, clearAuth, isAuthenticated } = AuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-xl font-bold text-white hover:text-primary transition-colors"
        >
          <Code className="w-6 h-6 text-primary" />
          Offline AI Code Review
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => router.push("/review")}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Review
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </button>

              <button
                onClick={() => router.push("/history")}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <History className="w-4 h-4" />
                History
              </button>
            </div>

            <div className="flex items-center gap-4 pl-4 border-l border-slate-700">
              <div className="hidden md:block text-sm">
                <p className="text-white font-medium">{user?.email}</p>
                <p className="text-slate-400 text-xs">Pro User</p>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6 text-sm">
            <button
              onClick={() => router.push("/#features")}
              className="hidden md:block text-gray-300 hover:text-white transition-colors"
            >
              Features
            </button>

            <button
              onClick={() => router.push("/#how-it-works")}
              className="hidden md:block text-gray-300 hover:text-white transition-colors"
            >
              How It Works
            </button>

            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/register")}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}



