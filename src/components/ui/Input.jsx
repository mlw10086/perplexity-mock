import React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, icon: Icon, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
          <Icon size={18} />
        </div>
      )}
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          Icon && "pl-10",
          className
        )}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";
export { Input };
