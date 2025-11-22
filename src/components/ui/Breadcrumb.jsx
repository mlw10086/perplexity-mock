import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [], className }) => {
  return (
    <nav aria-label="面包屑" className={cn("flex items-center space-x-2 text-sm", className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight size={14} className="text-text-muted" />}
          {item.href ? (
            <a
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary flex items-center gap-1",
                index === items.length - 1 ? "text-text-main font-medium" : "text-text-muted"
              )}
            >
              {item.icon && <item.icon size={14} />}
              {item.label}
            </a>
          ) : (
            <span
              className={cn(
                "flex items-center gap-1",
                index === items.length - 1 ? "text-text-main font-medium" : "text-text-muted"
              )}
            >
              {item.icon && <item.icon size={14} />}
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export { Breadcrumb };
