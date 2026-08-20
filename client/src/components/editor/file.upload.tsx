"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, FileCode } from "lucide-react";
import toast from "react-hot-toast";
import { detectLanguageFromFileName } from "@/libraries/language.detector";
import { SupportedLanguage } from "@/types";

interface FileUploadProps {
  onFileLoaded: (content: string, language: SupportedLanguage, fileName: string) => void;
}

const MAX_FILE_SIZE_MB = 2;
const ALLOWED_EXTENSIONS = [
  "js", "jsx", "ts", "tsx", "py", "java", "cpp", "cc", "c", "go", "sql", "html", "css",
];

export default function FileUpload({ onFileLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndReadFile = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "";

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      toast.error(`Unsupported file type: .${extension}`);
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File too large. Max size is ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const language = detectLanguageFromFileName(file.name);
      setFileName(file.name);
      onFileLoaded(content, language, file.name);
      toast.success(`Loaded ${file.name}`);
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndReadFile(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndReadFile(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl py-10 px-6 cursor-pointer transition-colors ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {fileName ? (
        <>
          <FileCode className="w-8 h-8 text-primary" />
          <p className="text-sm font-medium">{fileName}</p>
          <p className="text-xs text-gray-500">Click to upload a different file</p>
        </>
      ) : (
        <>
          <UploadCloud className="w-8 h-8 text-gray-400" />
          <p className="text-sm font-medium">
            Drag & drop a file, or <span className="text-primary">browse</span>
          </p>
          <p className="text-xs text-gray-500">
            Supports: {ALLOWED_EXTENSIONS.join(", ")} (max {MAX_FILE_SIZE_MB}MB)
          </p>
        </>
      )}
    </div>
  );
}

