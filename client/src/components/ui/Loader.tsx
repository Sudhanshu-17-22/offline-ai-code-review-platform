import { Loader2 } from "lucide-react";

interface LoaderProps {
  text?: string;
  fullScreen?: boolean;
}

export default function Loader({ text = "Loading...", fullScreen = false }: LoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen ? "min-h-screen" : "py-12"
      }`}
    >
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}
