'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = () => {
    const { resolvedTheme, setTheme } = useTheme();
    if (!resolvedTheme) return null;
    return (
        <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-lg border border-[#1F2B2A] bg-[#121918] hover:bg-[#1A2524] transition-all duration-200"
            aria-label="Toggle dark mode"
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {resolvedTheme === 'dark' ? (
                <Sun size={18} className="text-[#FCD34D]" />
            ) : (
                <Moon size={18} className="text-[#64748B]" />
            )}
        </button>
    );
};

