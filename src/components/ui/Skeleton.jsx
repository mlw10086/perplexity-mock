import React from 'react';
import { cn } from '@/lib/utils';

const Skeleton = ({ className, variant = "rectangular", ...props }) => {
  const variants = {
    rectangular: "rounded-lg",
    circular: "rounded-full",
    text: "rounded h-4",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-surface-hover",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

const SkeletonCard = () => (
  <div className="border border-border rounded-xl p-6 space-y-4">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-5/6" />
    <div className="flex gap-2 pt-2">
      <Skeleton variant="circular" className="h-8 w-8" />
      <Skeleton variant="circular" className="h-8 w-8" />
    </div>
  </div>
);

const SkeletonTable = ({ rows = 5 }) => (
  <div className="border border-border rounded-lg overflow-hidden">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex gap-4 p-4 border-b border-border last:border-0">
        <Skeleton variant="circular" className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

export { Skeleton, SkeletonCard, SkeletonTable };
