import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...rest }, ref) => {
    return (
      <div className="w-full">
        <label className="mb-3 block text-sm font-semibold text-[#D1D8D6]">
          {label}
        </label>
        <input
          ref={ref}
          className={`h-14 w-full rounded-xl border px-4 text-sm text-white shadow-inner shadow-black/10 transition-all duration-200 placeholder:text-[#586563] ${
            error
              ? "border-[#E11D48]/70 bg-[#E11D48]/4 focus:border-[#F43F5E] focus:ring-4 focus:ring-[#E11D48]/10"
              : "border-[#33403E]/80 bg-[#0D1212]/70 hover:border-[#465552] focus:border-[#2DD4BF] focus:bg-[#0D1212] focus:ring-4 focus:ring-[#2DD4BF]/10"
          } focus:outline-none ${className}`}
          {...rest}
        />
        {error && (
          <p className="mt-2 text-xs font-medium text-[#FB7185]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;

