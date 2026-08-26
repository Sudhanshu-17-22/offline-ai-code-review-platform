"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import CodeEditor from "@/components/editor/code.editor";
import LanguageSelector from "@/components/editor/language.selector";
import FileUpload from "@/components/editor/file.upload";
import Tabs from "@/components/ui/tabs";
import Button from "@/components/ui/Button";
import ProtectedRoute from "@/components/auth/protected.route";
import { SupportedLanguage } from "@/types";
import toast from "react-hot-toast";
import StreamingReviewPanel from "@/components/review/streaming.review.panel";
import { useReviewSocket } from "@/hooks/use.review.socket";

const PLACEHOLDER_CODE = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

function ReviewPageContent() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<"paste" | "upload">("paste");
    const [code, setCode] = useState(PLACEHOLDER_CODE);
    const [language, setLanguage] = useState<SupportedLanguage>("javascript");
    const [fileName, setFileName] = useState<string>("");
    const { state, submitReview, isConnected } = useReviewSocket();

    const handleFileLoaded = (
        content: string,
        detectedLanguage: SupportedLanguage,
        name: string
    ) => {
        setCode(content);
        setLanguage(detectedLanguage);
        setFileName(name);
    };

    const handleSubmitReview = () => {
        if (!code.trim()) {
            toast.error("Please add some code before submitting");
            return;
        }
        if (code.trim().length < 10) {
            toast.error("Code must be at least 10 characters");
            return;
        }
        if (!isConnected) {
            toast.error("Not connected to server. Please wait and try again.");
            return;
        }
        submitReview(
            code,
            language,
            fileName || "untitled"
        );
    };
    const handleComplete = (reviewId: string) => {
        router.push(`/review/${reviewId}`);
    };
    if (state.status !== "idle") {
        return (
            <div className="max-w-4xl mx-auto px-6 py-12">
                <StreamingReviewPanel
                    state={state}
                    onComplete={handleComplete}
                />
            </div>
        );
    }
    
    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">New Code Review</h1>
            <p className="text-gray-400 text-sm">
            Paste your code or upload a file — analysis runs 100% offline on your machine.
            </p>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <Tabs
            tabs={[
                { id: "paste", label: "Paste Code" },
                { id: "upload", label: "Upload File" },
            ]}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as "paste" | "upload")}
        />

        {activeTab === "paste" && (
            <LanguageSelector value={language} onChange={setLanguage} />
        )}
        </div>

        {/* Upload or Editor */}
        {activeTab === "upload" && !fileName && (
            <div className="mb-4">
            <FileUpload onFileLoaded={handleFileLoaded} />
            </div>
        )}

        {(activeTab === "paste" || fileName) && (
            <CodeEditor code={code} language={language} onChange={setCode} />
        )}

        {/* Connection Status */}
        {!isConnected && (
            <p className="text-yellow-400 text-sm mb-4">
                Connecting to review server...
            </p>
        )}

        {/* Submit Bar */}
        <div className="flex items-center justify-between mt-6">
        <p className="text-xs text-gray-500">
            {code.split("\n").length} lines · {language}
        </p>
        <Button
            variant="primary"
            onClick={handleSubmitReview}
            disabled={!isConnected || code.trim().length < 10}
            className="px-6"
        >
            <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Run AI Review
            </span>
        </Button>
        </div>
    </div>
  );
}

export default function ReviewPage() {
    return (
        <ProtectedRoute>
        <ReviewPageContent />
        </ProtectedRoute>
    );
}




