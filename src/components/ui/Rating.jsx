import React from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

const Rating = ({ value = 0, onChange, max = 5, readonly = false, size = 20, className }) => {
  const [hoverValue, setHoverValue] = React.useState(0);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverValue || value);

        return (
          <button
            key={index}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(starValue)}
            onMouseEnter={() => !readonly && setHoverValue(starValue)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            className={cn(
              "transition-all duration-150",
              !readonly && "cursor-pointer hover:scale-110",
              readonly && "cursor-default"
            )}
          >
            <Star
              size={size}
              className={cn(
                "transition-colors",
                isFilled ? "fill-yellow-500 text-yellow-500" : "text-text-muted"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export { Rating };
