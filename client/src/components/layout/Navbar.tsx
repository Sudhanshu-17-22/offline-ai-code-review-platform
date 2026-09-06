"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthStore } from "@/store/auth.store";
import { LogOut, BarChart3, History, Plus, Code, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme.toggle";

export default function Navbar() {
  const router = useRouter();
  const user = AuthStore((state) => state.user);
  const clearAuth = AuthStore((state) => state.clearAuth);
  const isAuthenticated = AuthStore((state) => state.isAuthenticated);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/6 bg-[#080B0B]/80 backdrop-blur-xl shadow-lg shadow-black/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-bold text-white hover:text-[#99F6E4] transition-all duration-200"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2DD4BF]/10 border border-[#5EEAD4]/20">
            <Code className="w-5 h-5 text-[#5EEAD4]" />
          </span>
          <span className="hidden sm:inline tracking-tight">
            Offline AI Code Review
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1.5">
          {isAuthenticated ? (
            <>
              <Link
                href="/review"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[#C9D1D0] hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                New Review
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[#C9D1D0] hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>

              <Link
                href="/history"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[#C9D1D0] hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                <History className="w-4 h-4" />
                History
              </Link>

              <ThemeToggle />

              <div className="flex items-center gap-4 pl-4 ml-2 border-l border-white/8">
                <div className="hidden lg:block text-sm max-w-45">
                  <p className="text-white font-medium truncate">{user?.email}</p>
                  <p className="text-[#737F7D] text-xs mt-0.5">Pro User</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[#C9D1D0] hover:text-[#FDA4AF] hover:bg-[#F43F5E]/10 rounded-lg transition-all duration-200"
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
                className="px-3.5 py-2 text-sm font-medium text-[#C9D1D0] hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                Features
              </Link>

              <Link
                href="/#how-it-works"
                className="px-3.5 py-2 text-sm font-medium text-[#C9D1D0] hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                How It Works
              </Link>

              <Link
                href="/login"
                className="px-3.5 py-2 text-sm font-medium text-[#C9D1D0] hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="ml-1 px-5 py-2.5 rounded-lg bg-[#2DD4BF] text-[#071313] text-sm font-semibold shadow-lg shadow-[#2DD4BF]/20 hover:bg-[#5EEAD4] hover:shadow-[#2DD4BF]/30 hover:-translate-y-0.5 transition-all duration-200"
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
            className="p-2 text-[#C9D1D0] hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden border-t border-white/6 bg-[#080B0B]/95 backdrop-blur-xl px-4 py-4">
          {isAuthenticated ? (
            <div className="flex flex-col gap-1.5">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#C9D1D0] hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>

              <Link
                href="/review"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#C9D1D0] hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                <Plus className="w-4 h-4" />
                New Review
              </Link>

              <Link
                href="/history"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#C9D1D0] hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                <History className="w-4 h-4" />
                History
              </Link>

              <div className="border-t border-white/8 mt-2 pt-3">
                <div className="px-4 py-2 mb-2">
                  <p className="text-white font-medium text-sm truncate">{user?.email}</p>
                  <p className="text-[#737F7D] text-xs mt-0.5">Pro User</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#FB7185] hover:text-[#FDA4AF] hover:bg-[#F43F5E]/10 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Link
                href="/#features"
                className="px-4 py-3 text-sm font-medium text-[#C9D1D0] hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>

              <Link
                href="/#how-it-works"
                className="px-4 py-3 text-sm font-medium text-[#C9D1D0] hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>

              <Link
                href="/login"
                className="px-4 py-3 text-sm font-medium text-[#C9D1D0] hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>

              <Link
                href="/register"
                className="mt-1 px-4 py-3 text-center text-sm font-semibold bg-[#2DD4BF] text-[#071313] rounded-lg shadow-lg shadow-[#2DD4BF]/20 hover:bg-[#5EEAD4] transition-all duration-200"
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

