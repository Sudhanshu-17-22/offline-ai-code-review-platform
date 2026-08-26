"use client";

import { useState, useRef } from "react";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import { detectLanguageFromFileName } from "@/libraries/language.detector";
import { SupportedLanguage } from "@/types";

interface FileUploadProps {
  onFileLoaded: (content: string, language: SupportedLanguage, fileName: string) => void;
}

const MAX_FILE_SIZE_MB = 1;
const SUPPORTED_EXTENSIONS = [
  "js", "jsx", "ts", "tsx", "py", "java", "cpp", "cc", "c", "go", "sql", "html", "css",
];

export default function FileUpload({ onFileLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError("");
    setSuccess("");

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    const ext = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();

    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      setError(
        `Unsupported file type. Supported: ${SUPPORTED_EXTENSIONS.join(", ")}`
      );
      return;
    }

    setUploading(true);

    try {
      const text = await file.text();
      const language = detectLanguageFromFileName(file.name);

      onFileLoaded(text, language, file.name);

      setSuccess(`✓ Loaded: ${file.name}`);

      setTimeout(() => { setSuccess("")}, 3000);
    } catch {
      setError("Failed to read file");
    } finally {
      setUploading(false);
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  };

  return (
    <div>
      {/* Drag & Drop Zone */}
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDrop={handleDrop}
        onClick={() => {
          if (!uploading) {
            inputRef.current?.click();
          }
        }}
        className={`relative p-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-900/20"
            : "border-slate-600 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-900/60"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={SUPPORTED_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
          onChange={handleFileInputChange}
          disabled={uploading}
          className="hidden"
        />

        <div className="text-center">
          <Upload
            className={`w-12 h-12 mx-auto mb-3 transition-colors ${
              isDragging ? "text-blue-400" : "text-slate-400"
            }`}
          />

          <p className="text-white font-medium mb-1">
            {uploading
              ? "Uploading..."
              : "Drag and drop your code file"}
          </p>

          <p className="text-slate-400 text-sm">
            or click to browse
          </p>

          <p className="text-slate-500 text-xs mt-3">
            Supported: JS, TS, Python, Java, C++, C, Go, SQL, HTML,
            CSS (Max 1MB)
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-700/30 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />

          <p className="text-red-300 text-sm">
            {error}
          </p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-700/30 rounded-lg flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />

          <p className="text-green-300 text-sm">
            {success}
          </p>
        </div>
      )}
    </div>
  );
}

