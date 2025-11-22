import React from 'react';
import { cn } from '@/lib/utils';

const RadioGroup = ({ value, onValueChange, children, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            checked: child.props.value === value,
            onSelect: () => onValueChange(child.props.value)
          });
        }
        return child;
      })}
    </div>
  );
};

const RadioItem = React.forwardRef(({ className, checked, onSelect, label, value, ...props }, ref) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      ref={ref}
      className={cn(
        "h-5 w-5 rounded-full border-2 border-border bg-surface transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center",
        checked && "border-primary",
        className
      )}
      {...props}
    >
      {checked && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
    </button>
    {label && <label className="text-sm text-text-main cursor-pointer select-none" onClick={onSelect}>{label}</label>}
  </div>
));
RadioItem.displayName = "RadioItem";

export { RadioGroup, RadioItem };
