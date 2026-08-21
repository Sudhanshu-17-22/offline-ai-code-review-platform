interface ScoreGaugeProps {
    score: number;
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
    const getColor = () => {
        if (score >= 80) return "#22c55e"; // success green
        if (score >= 50) return "#f59e0b"; // warning amber
        return "#ef4444"; // danger red
    };

    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
            {/* Background track */}
            <circle
            cx="64"
            cy="64"
            r="45"
            fill="none"
            stroke="#2a2a3c"
            strokeWidth="10"
            />
            {/* Progress arc */}
            <circle
            cx="64"
            cy="64"
            r="45"
            fill="none"
            stroke={getColor()}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            />
        </svg>
        <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold" style={{ color: getColor() }}>
            {score}
            </span>
            <span className="text-xs text-gray-500">/ 100</span>
        </div>
        </div>
    );
}


