"use client";

import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
variant?: "primary" | "secondary" | "danger" | "ghost";
size?: "sm" | "md" | "lg";
isLoading?: boolean;
children?: React.ReactNode;
};

export default function Button({
variant = "primary",
size = "md",
isLoading = false,
disabled,
className = "",
children,
...props
}: ButtonProps) {
const baseStyles =
"inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/40 focus:ring-offset-2 focus:ring-offset-[#080B0B] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

const variantStyles = {
primary:
"bg-gradient-to-r from-[#14B8A6] via-[#2DD4BF] to-[#0D9488] text-[#071313] shadow-lg shadow-[#2DD4BF]/25 border border-[#5EEAD4]/20 hover:from-[#2DD4BF] hover:via-[#5EEAD4] hover:to-[#14B8A6] hover:shadow-xl hover:shadow-[#2DD4BF]/35 hover:-translate-y-0.5",
secondary:
"border border-[#33403E] bg-[#0D1212]/80 text-[#D1D8D6] shadow-md shadow-black/10 hover:border-[#2DD4BF]/50 hover:bg-[#151D1C] hover:text-white hover:shadow-lg hover:shadow-[#2DD4BF]/10",
danger:
"bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white shadow-lg shadow-[#E11D48]/20 border border-[#FB7185]/20 hover:from-[#F43F5E] hover:to-[#E11D48] hover:shadow-xl hover:shadow-[#E11D48]/30 hover:-translate-y-0.5",
ghost:
"text-[#B8C2C0] border border-transparent hover:bg-white/[0.06] hover:text-white hover:border-[#33403E]/60",
};

const sizeStyles = {
sm: "min-h-9 px-3.5 py-2 text-sm",
md: "min-h-11 px-5 py-2.5 text-sm",
lg: "min-h-12 px-7 py-3 text-base",
};

return (
<button
disabled={disabled || isLoading}
className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
{...props}
>
{isLoading ? (
<> <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
Loading...
</>
) : (
children
)} </button>
);
}

