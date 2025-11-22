import React from 'react';
import { cn } from '@/lib/utils';

const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-surface hover:bg-surface-hover text-text-main border border-border",
    primary: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-secondary text-background",
    outline: "text-text-main border border-border",
    success: "bg-green-500/10 text-green-500 border border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20",
  };

  return (
    <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)} {...props}>
      {children}
    </div>
  );
};

export { Badge };
