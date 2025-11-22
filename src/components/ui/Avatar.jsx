import React from 'react';
import { cn } from '@/lib/utils';

const Avatar = React.forwardRef(({ className, src, alt, fallback, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border", className)}
    {...props}
  >
    {src ? (
       <img className="aspect-square h-full w-full object-cover" src={src} alt={alt} />
    ) : (
       <div className="flex h-full w-full items-center justify-center rounded-full bg-surface-hover text-text-muted">
          {fallback || alt?.charAt(0).toUpperCase()}
       </div>
    )}
  </div>
));
Avatar.displayName = "Avatar";

export { Avatar };
