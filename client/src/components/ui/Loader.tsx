"use client";

interface LoaderProps {
  text?: string;
  fullScreen?: boolean;
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function Loader({
  text,
  message,
  fullScreen = false,
  size = "md",
}: LoaderProps) {
  const sizeStyles = {
    sm: "w-8 h-8 border-2",
    md: "w-12 h-12 border-4",
    lg: "w-16 h-16 border-4",
  };

  const loadingMessage = message ?? text ?? "Loading...";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen ? "min-h-screen" : "py-12"
      }`}
    >
      <div
        className={`${sizeStyles[size]} border-slate-600 border-t-blue-500 rounded-full animate-spin`}
      />

      {loadingMessage && (
        <p className="text-slate-400 text-sm">
          {loadingMessage}
        </p>
      )}
    </div>
  );
}