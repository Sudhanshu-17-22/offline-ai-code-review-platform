import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...rest }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
        </label>
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-lg bg-background-secondary border ${
            error ? "border-danger" : "border-border"
          } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${className}`}
          {...rest}
        />
        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;


