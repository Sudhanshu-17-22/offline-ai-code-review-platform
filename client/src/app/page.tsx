"use client";

import { useRouter } from "next/navigation";
import { AuthStore } from "@/store/auth.store";
import { ArrowRight, Code, Zap, BarChart3 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = AuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
          AI-Powered Code
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Review Platform
          </span>
        </h1>

        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Get instant, offline code reviews powered by local AI. No data leaves your
          machine. Perfect for enterprise teams with strict compliance requirements.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() =>
              isAuthenticated ? router.push("/review") : router.push("/register")
            }
            size="lg"
          >
            <Zap className="w-5 h-5" />
            {isAuthenticated ? "Start Reviewing" : "Get Started Free"}
          </Button>

          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8">
            <Code className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Real-Time Streaming
            </h3>
            <p className="text-slate-400">
              Watch AI analysis stream in real-time, just like ChatGPT. See results as
              they&apos;re generated.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8">
            <BarChart3 className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Comprehensive Analytics
            </h3>
            <p className="text-slate-400">
              Track your code quality over time with detailed metrics, trends, and
              insights.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8">
            <Zap className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">100% Offline</h3>
            <p className="text-slate-400">
              All processing happens locally. Your code never leaves your machine.
              Enterprise-grade privacy.
            </p>
          </div>
        </div>
      </div>

      {isAuthenticated && (
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            View Your Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

