import React from 'react';
import { cn } from '@/lib/utils';

const Tooltip = ({ children, content, position = "top" }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className={cn(
          "absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-fade-in",
          positions[position]
        )}>
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45" 
               style={{
                 [position === 'top' ? 'bottom' : position === 'bottom' ? 'top' : position === 'left' ? 'right' : 'left']: '-4px',
                 ...(position === 'top' || position === 'bottom' ? { left: '50%', transform: 'translateX(-50%) rotate(45deg)' } : { top: '50%', transform: 'translateY(-50%) rotate(45deg)' })
               }}
          />
        </div>
      )}
    </div>
  );
};

export { Tooltip };
