'use client';

export const DemoModeBanner = () => {
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

    if (!isDemoMode) return null;
    return (
        <div className="bg-amber-500 text-white text-center py-2 text-sm font-medium">
            🎬 Demo Mode: This deployment shows mock AI responses.
            <a
                href="https://github.com/yourusername/offline-ai-code-review-platform"
                className="underline ml-1"
                target="_blank"
                rel="noopener noreferrer"
            >
                Clone & run locally
            </a>{' '}
            for full offline AI-powered reviews with Ollama.
        </div>
    );
};


