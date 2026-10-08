import * as React from "react";
import { slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const slots = slot("div", props);
    
    const variants = {
      primary: "bg-paypalBlue text-white hover:bg-blue-600 shadow-[0_0_20px_-5px_rgba(0,112,243,0.4)]",
      outline: "bg-transparent border border-white/10 text-white hover:bg-white/10",
      ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
      accent: "bg-electricViolet text-white hover:bg-violet-600 shadow-[0_0_20px_-5px_rgba(138,43,226,0.4)]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all active:scale-95",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
