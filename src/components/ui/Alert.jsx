import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const Alert = ({ className, variant = "default", title, children, onClose, ...props }) => {
  const variants = {
    default: {
      container: "bg-surface border-border text-text-main",
      icon: Info,
      iconColor: "text-text-muted"
    },
    success: {
      container: "bg-green-500/10 border-green-500/20 text-green-500",
      icon: CheckCircle,
      iconColor: "text-green-500"
    },
    warning: {
      container: "bg-yellow-500/10 border-yellow-500/20 text-yellow-500",
      icon: AlertTriangle,
      iconColor: "text-yellow-500"
    },
    error: {
      container: "bg-red-500/10 border-red-500/20 text-red-500",
      icon: AlertCircle,
      iconColor: "text-red-500"
    },
    info: {
      container: "bg-primary/10 border-primary/20 text-primary",
      icon: Info,
      iconColor: "text-primary"
    }
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative rounded-lg border p-4",
        config.container,
        className
      )}
      {...props}
    >
      <div className="flex gap-3">
        <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.iconColor)} />
        <div className="flex-1">
          {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export { Alert };
