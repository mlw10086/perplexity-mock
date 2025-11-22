import React from 'react';
import { cn } from '@/lib/utils';

const Slider = React.forwardRef(({ className, value = 50, onChange, min = 0, max = 100, step = 1, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <input
        type="range"
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className={cn(
          "w-full h-2 bg-surface-hover rounded-lg appearance-none cursor-pointer",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110",
          "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg",
          className
        )}
        style={{
          background: `linear-gradient(to right, #13B9C4 0%, #13B9C4 ${((value - min) / (max - min)) * 100}%, #2D2F2F ${((value - min) / (max - min)) * 100}%, #2D2F2F 100%)`
        }}
        {...props}
      />
    </div>
  );
});
Slider.displayName = "Slider";

export { Slider };
