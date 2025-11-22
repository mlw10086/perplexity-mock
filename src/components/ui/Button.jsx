import React from 'react';
import { cn } from '@/lib/utils';

const Button = React.forwardRef(({ className, variant = "primary", size = "md", children, ...props }, ref) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/20",
    secondary: "bg-surface text-text-main hover:bg-surface-hover border border-border",
    ghost: "bg-transparent text-text-muted hover:text-text-main hover:bg-surface-hover",
    outline: "bg-transparent border border-border text-text-muted hover:text-text-main hover:bg-surface-hover",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10 p-0 flex items-center justify-center",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
export { Button };
