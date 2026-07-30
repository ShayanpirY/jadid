import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm",
            "text-slate-200 placeholder:text-slate-500",
            "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500",
            "transition-all duration-200",
            error && "border-pink-500 focus:ring-pink-500/50 focus:border-pink-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-pink-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
