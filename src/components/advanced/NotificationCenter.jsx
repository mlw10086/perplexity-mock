import React from 'react';
import { cn } from '@/lib/utils';
import { Bell, Check, X, Info, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const NotificationItem = ({ notification, onMarkRead, onDismiss }) => {
  const icons = {
    info: Info,
    success: Check,
    error: AlertCircle,
  };

  const Icon = icons[notification.type] || Info;

  return (
    <div className={cn(
      "flex gap-3 p-4 border-b border-border last:border-0 hover:bg-surface-hover transition-colors",
      !notification.read && "bg-primary/5"
    )}>
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
        notification.type === 'success' && "bg-green-500/10 text-green-500",
        notification.type === 'error' && "bg-red-500/10 text-red-500",
        notification.type === 'info' && "bg-primary/10 text-primary"
      )}>
        <Icon size={20} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-medium text-sm text-text-main">{notification.title}</h4>
          {!notification.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />}
        </div>
        <p className="text-sm text-text-muted mb-2">{notification.message}</p>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span>{notification.time}</span>
          {!notification.read && (
            <button
              onClick={() => onMarkRead?.(notification.id)}
              className="text-primary hover:underline"
            >
              标记已读
            </button>
          )}
          <button
            onClick={() => onDismiss?.(notification.id)}
            className="text-text-muted hover:text-text-main hover:underline"
          >
            忽略
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationCenter = ({ notifications = [], onMarkAllRead, onClearAll }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border bg-surface-hover">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-text-muted" />
          <h3 className="font-semibold text-text-main">通知</h3>
          {unreadCount > 0 && (
            <Badge variant="primary" className="text-xs">{unreadCount}</Badge>
          )}
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
              全部已读
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            清空
          </Button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            <Bell size={48} className="mx-auto mb-4 opacity-50" />
            <p>暂无通知</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        )}
      </div>
    </div>
  );
};

export { NotificationCenter };
