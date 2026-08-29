"use client";

import Editor from "@monaco-editor/react";
import { SupportedLanguage } from "@/types";
import { ChevronDown, Copy, Trash2 } from "lucide-react";
import { useState } from "react";

interface CodeEditorProps {
code: string;
language: SupportedLanguage;
onChange: (value: string) => void;
onLanguageChange?: (language: SupportedLanguage) => void;
height?: string;
}

const LANGUAGES: SupportedLanguage[] = [
"javascript",
"typescript",
"python",
"java",
"cpp",
"go",
"sql",
"html",
"css",
];

export default function CodeEditor({
code,
language,
onChange,
onLanguageChange,
height = "500px",
}: CodeEditorProps) {
const [copied, setCopied] = useState(false);
const [showLanguageMenu, setShowLanguageMenu] = useState(false);

const copyToClipboard = async () => {
await navigator.clipboard.writeText(code);
setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);

};

const clearCode = () => {
if (window.confirm("Clear all code?")) {
onChange("");
}
};

  return (
    <div className="flex flex-col h-[500px] rounded-xl overflow-hidden border border-border">
      <div className="bg-slate-900/50 border-b border-slate-700 px-4 py-3 flex items-center justify-between gap-2">
        <div className="relative">
<button
type="button"
onClick={() => setShowLanguageMenu(!showLanguageMenu)}
className="inline-flex items-center gap-2 px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
>
            <span className="capitalize">{language}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

      {showLanguageMenu && (
        <div className="absolute top-full left-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 min-w-max">
          {LANGUAGES.map((lang) => (
            <button
              type="button"
              key={lang}
              onClick={() => {
                onLanguageChange?.(lang);
                setShowLanguageMenu(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                language === lang
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700"
              }`}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>
      )}
        </div>

        <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={copyToClipboard}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-white text-sm transition-colors"
        title="Copy code"
      >
        <Copy className="w-4 h-4" />
        {copied ? "Copied!" : "Copy"}
      </button>

      <button
        type="button"
        onClick={clearCode}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-slate-700 hover:bg-red-600 text-white text-sm transition-colors"
        title="Clear code"
      >
        <Trash2 className="w-4 h-4" />
        Clear
      </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 h-full">
    <Editor
      height="100%"
      language={language}
      value={code}
      onChange={(value) => onChange(value || "")}
      theme="vs-dark"
      options={{
        minimap: {
          enabled: false,
        },
        fontSize: 14,
        fontFamily: "var(--font-jetbrains), monospace",
        wordWrap: "on",
        automaticLayout: true,
        scrollBeyondLastLine: false,
        tabSize: 2,
        insertSpaces: true,
        formatOnPaste: true,
        formatOnType: true,
        padding: {
          top: 16,
          bottom: 16,
        },
        lineNumbers: "on",
        renderLineHighlight: "all",
      }}
    />
      </div>
    </div>

  );
}



