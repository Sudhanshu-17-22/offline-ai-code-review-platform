"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Code2, LogIn, ShieldCheck, Sparkles } from "lucide-react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/use.auth";

const loginSchema = z.object({
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden px-6 py-16 sm:px-8 lg:px-12">
      <div className="absolute -left-40 top-16 h-96 w-96 rounded-full bg-indigo-500/15 blur-[120px]" />
      <div className="absolute -right-40 bottom-12 h-96 w-96 rounded-full bg-violet-500/15 blur-[120px]" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-12">
        <div className="hidden lg:col-span-7 lg:block">
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            Privacy-first AI code review
          </div>

          <h1 className="max-w-xl text-5xl font-extrabold leading-[1.15] tracking-tight text-slate-100 sm:text-6xl">
            Review your code with{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-sky-400 bg-clip-text text-transparent">
              AI. Completely offline.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
            Get intelligent code feedback without sending your source code to
            external servers.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                <ShieldCheck className="h-5 w-5" />
              </span>
              Your source code stays private
            </div>

            <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                <Code2 className="h-5 w-5" />
              </span>
              AI-powered semantic code analysis
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md lg:col-span-5">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl shadow-indigo-950/50 backdrop-blur-2xl sm:p-10">
            <div className="mb-12 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-sky-500/20 shadow-inner">
                <LogIn className="h-7 w-7 text-indigo-300" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-100">
                Welcome back
              </h2>

              <p className="mt-3 text-sm text-slate-400">
                Sign in to continue reviewing your code
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register("password")}
              />

              <Button
                type="submit"
                variant="primary"
                className="mt-2 w-full !rounded-xl !bg-gradient-to-r !from-indigo-600 !via-violet-600 !to-indigo-600 !py-3.5 !text-base !font-semibold !shadow-xl !shadow-indigo-600/25 transition-all duration-300 hover:!opacity-95 active:scale-[0.99]"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <div className="my-12 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                SECURE ACCESS
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            </div>

            <p className="text-center text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300 underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          <p className="mt-10 text-center text-xs text-slate-500">
            Your code never leaves your local environment.
          </p>
        </div>
      </div>
    </div>
  );
}








