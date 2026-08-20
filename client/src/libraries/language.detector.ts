import { SupportedLanguage } from "@/types";

const extensionMap: Record<string, SupportedLanguage> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    java: "java",
    cpp: "cpp",
    cc: "cpp",
    c: "cpp",
    go: "go",
    sql: "sql",
    html: "html",
    css: "css",
};

export function detectLanguageFromFileName(
   fileName: string
): SupportedLanguage {
        const extension = fileName.split(".").pop()?.toLowerCase() || "";
        return extensionMap[extension] || "javascript";
}

export function toMonacoLanguage(language: SupportedLanguage): string {
    const monacoMap: Record<SupportedLanguage, string> = {
        javascript: "javascript",
        typescript: "typescript",
        python: "python",
        java: "java",
        cpp: "cpp",
        go: "go",
        sql: "sql",
        html: "html",
        css: "css",
    };
    return monacoMap[language] || "plaintext";
}

export const supportedLanguages: { value: SupportedLanguage; label: string }[] = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "go", label: "Go" },
    { value: "sql", label: "SQL" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
];



