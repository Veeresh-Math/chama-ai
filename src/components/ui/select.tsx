"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

interface SelectContextType {
  value: string;
  onValueChange?: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ value, onValueChange, children, className, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || "");
    const selectedValue = value ?? internalValue;
    const handleChange = (newValue: string) => {
      if (value === undefined) setInternalValue(newValue);
      onValueChange?.(newValue);
    };
    return (
      <SelectContext.Provider value={{ value: selectedValue, onValueChange: handleChange }}>
        <div ref={ref} className={cn("w-full relative", className)} {...props}>
          {children}
        </div>
      </SelectContext.Provider>
    );
  }
);
Select.displayName = "Select";

const SelectTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => {
    return <span ref={ref} className={cn("truncate", className)} {...props}>{children}</span>;
  }
);
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 mt-2 max-h-[var(--radix-select-content-available-height)] overflow-hidden rounded-md border bg-white shadow-lg py-1 text-sm outline-none [data-state=open]:animate-in [data-state=closed]:animate-out [data-state=closed]:fade-out-0 [data-state=open]:fade-in-0 [data-state=closed]:zoom-out-95 [data-state=open]:zoom-in-95 [data-side=bottom]:slide-in-from-top-2 [data-side=left]:slide-in-from-right-2 [data-side=right]:slide-in-from-left-2 [data-side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(
  ({ className, children, value, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) return null;
    return (
      <div
        ref={ref}
        role="option"
        aria-selected={context.value === value}
        className={cn(
          "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-gray-100",
          context.value === value && "bg-gray-100",
          className
        )}
        onClick={(e) => {
          e.stopPropagation();
          context.onValueChange?.(value);
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
