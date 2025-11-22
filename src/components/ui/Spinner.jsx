import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const Spinner = ({ className, size = 24, ...props }) => {
  return (
    <Loader2
      className={cn("animate-spin text-primary", className)}
      size={size}
      {...props}
    />
  );
};

export { Spinner };
