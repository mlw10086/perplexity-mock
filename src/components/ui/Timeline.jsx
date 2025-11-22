import React from 'react';
import { cn } from '@/lib/utils';

const Timeline = ({ children, className }) => {
  return (
    <div className={cn("relative space-y-8", className)}>
      <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-border" />
      {children}
    </div>
  );
};

const TimelineItem = ({ icon: Icon, title, description, time, active = false, className }) => {
  return (
    <div className={cn("relative flex gap-4", className)}>
      <div
        className={cn(
          "relative z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
          active
            ? "border-primary bg-primary"
            : "border-border bg-surface"
        )}
      >
        {Icon && <Icon size={12} className={active ? "text-white" : "text-text-muted"} />}
      </div>
      <div className="flex-1 pb-8">
        <div className="flex items-center justify-between mb-1">
          <h4 className={cn("font-medium", active ? "text-primary" : "text-text-main")}>
            {title}
          </h4>
          {time && <span className="text-xs text-text-muted">{time}</span>}
        </div>
        {description && <p className="text-sm text-text-muted">{description}</p>}
      </div>
    </div>
  );
};

export { Timeline, TimelineItem };
