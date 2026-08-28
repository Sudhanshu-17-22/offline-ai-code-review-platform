'use client';

import React, { ComponentType, ErrorInfo, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: (error: Error, reset: () => void) => ReactNode;
    onHome?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundaryClass extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);

        fetch('/api/logs/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
        }),
        }).catch(() => {});
    }

    reset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
        if (this.props.fallback) {
            return this.props.fallback(this.state.error!, this.reset);
        }
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-100 p-3 rounded-full">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                    </div>

                        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
                            Oops! Something went wrong
                        </h1>

                        <p className="text-center text-gray-600 mb-6">
                            We encountered an unexpected error. Dont worry, our team is on it.
                        </p>

                        {process.env.NODE_ENV === 'development' && (
                        <div className="bg-red-50 border border-red-200 rounded p-4 mb-6 text-sm font-mono overflow-auto max-h-32">
                            <p className="text-red-800">{this.state.error?.message}</p>
                        </div>
                        )}

                        <div className="flex gap-3">
                        <button
                            onClick={this.reset}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition"
                        >
                            <RefreshCw size={18} />
                                Try Again
                        </button>

                        <button
                            onClick={this.props.onHome}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 px-4 rounded-lg font-medium transition"
                        >
                            <Home size={18} />
                                Home
                        </button>
                    </div>
                </div>
            </div>
        );
        }

        return this.props.children;
    }
    }

    export function ErrorBoundary(props: Props) {
    const router = useRouter();

    return (
        <ErrorBoundaryClass
        {...props}
        onHome={() => router.push('/')}
        />
    );
}

export function withAsyncErrorBoundary<P extends object>(
    Component: ComponentType<P>
) {
    function AsyncErrorBoundary(props: P) {
        return (
        <ErrorBoundary>
            <Component {...props} />
        </ErrorBoundary>
        );
    }

    AsyncErrorBoundary.displayName = `withAsyncErrorBoundary(${
        Component.displayName || Component.name || 'Component'
    })`;

    return AsyncErrorBoundary;
}





