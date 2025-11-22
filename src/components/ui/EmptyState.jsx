import React from 'react';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

const EmptyState = ({ 
  icon: Icon = Inbox, 
  title = "暂无数据", 
  description, 
  action,
  actionLabel,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="w-16 h-16 rounded-full bg-surface-hover flex items-center justify-center mb-4">
        <Icon size={32} className="text-text-muted" />
      </div>
      <h3 className="text-lg font-medium text-text-main mb-2">{title}</h3>
      {description && <p className="text-sm text-text-muted mb-6 max-w-sm">{description}</p>}
      {action && actionLabel && (
        <Button onClick={action} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export { EmptyState };
