'use client';

interface SkeletonProps {
    className?: string;
    count?: number;
}

export const Skeleton = ({
    className = '',
    count = 1,
}: SkeletonProps) => (
    <>
        {Array.from({ length: count }, (_, i) => (
            <div
                key={i}
                className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded ${className}`}
            />
        ))}
    </>
);

export const ReviewResultSkeleton = () => (
    <div className="space-y-6 p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-24 w-full" />
        </div>

        <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            {Array.from({ length: 4 }, (_, i) => (
                <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3"
                >
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
    </div>
);

export const DashboardSkeleton = () => (
    <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
                <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg p-6"
                >
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-10 w-full" />
                </div>
            ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-64 w-full" />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-4">
                {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        </div>
    </div>
);
export const HistorySkeleton = () => (
    <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-full mb-6" />
        {Array.from({ length: 5 }, (_, i) => (
            <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3"
            >
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        ))}
    </div>
);
export const CodeEditorSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full rounded-lg" />
        <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
        </div>
    </div>
);



