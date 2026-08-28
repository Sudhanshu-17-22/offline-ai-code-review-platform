"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthStore } from "@/store/auth.store";
import { LogOut, BarChart3, History, Plus, Code, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme.toggle";

export default function Navbar() {
  const router = useRouter();
  const { user, clearAuth, isAuthenticated } = AuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    setIsOpen(false);
    router.push("/login");
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-white hover:text-primary transition-colors"
        >
          <Code className="w-6 h-6 text-primary" />
          <span className="hidden sm:inline">Offline AI Code Review</span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/review"
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Review
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>

              <Link
                href="/history"
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <History className="w-4 h-4" />
                History
              </Link>

              <ThemeToggle />

              <div className="flex items-center gap-4 pl-4 border-l border-slate-700">
                <div className="hidden lg:block text-sm">
                  <p className="text-white font-medium">{user?.email}</p>
                  <p className="text-slate-400 text-xs">Pro User</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/#features"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Features
              </Link>

              <Link
                href="/#how-it-works"
                className="text-gray-300 hover:text-white transition-colors"
              >
                How It Works
              </Link>

              <Link
                href="/login"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>

              <ThemeToggle />
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-300 hover:bg-slate-700/50 rounded-lg transition"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4">
          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>

              <Link
                href="/review"
                className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Plus className="w-4 h-4" />
                New Review
              </Link>

              <Link
                href="/history"
                className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <History className="w-4 h-4" />
                History
              </Link>

              <div className="border-t border-slate-700 mt-2 pt-3">
                <div className="px-4 py-2 mb-2">
                  <p className="text-white font-medium text-sm">{user?.email}</p>
                  <p className="text-slate-400 text-xs">Pro User</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/#features"
                className="px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>

              <Link
                href="/#how-it-works"
                className="px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>

              <Link
                href="/login"
                className="px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-4 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}



