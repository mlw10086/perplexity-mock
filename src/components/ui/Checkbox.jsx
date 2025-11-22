import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, label, ...props }, ref) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      ref={ref}
      className={cn(
        "peer h-5 w-5 shrink-0 rounded border-2 border-border bg-surface transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked && "bg-primary border-primary",
        className
      )}
      {...props}
    >
      {checked && <Check size={14} className="text-white" strokeWidth={3} />}
    </button>
    {label && <label className="text-sm text-text-main cursor-pointer select-none">{label}</label>}
  </div>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
