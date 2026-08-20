"use client";

import Editor from "@monaco-editor/react";
import { SupportedLanguage } from "@/types";
import { toMonacoLanguage } from "@/libraries/language.detector";

interface CodeEditorProps {
  code: string;
  language: SupportedLanguage;
  onChange: (value: string) => void;
  height?: string;
}

export default function CodeEditor({
  code,
  language,
  onChange,
  height = "500px",
}: CodeEditorProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <Editor
        height={height}
        language={toMonacoLanguage(language)}
        value={code}
        onChange={(value) => onChange(value || "")}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "var(--font-jetbrains), monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          lineNumbers: "on",
          renderLineHighlight: "all",
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
        }}
      />
    </div>
  );
}





