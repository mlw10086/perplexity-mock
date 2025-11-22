import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MoreVertical, Plus } from 'lucide-react';

const KanbanColumn = ({ title, items, count, color, onAddItem }) => {
  return (
    <div className="flex-1 min-w-[280px] flex flex-col max-h-[calc(100vh-300px)]">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", color)} />
          <h3 className="font-medium text-text-main">{title}</h3>
          <Badge variant="outline" className="text-xs">{count}</Badge>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onAddItem}
            className="p-1 hover:bg-surface-hover rounded transition-colors"
          >
            <Plus size={16} className="text-text-muted" />
          </button>
          <button className="p-1 hover:bg-surface-hover rounded transition-colors">
            <MoreVertical size={16} className="text-text-muted" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-2">
        {items.map((item, index) => (
          <KanbanCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

const KanbanCard = ({ title, description, tags, assignee, priority }) => {
  const priorityColors = {
    high: "bg-red-500/10 text-red-500 border-red-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    low: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  return (
    <Card className="p-4 cursor-pointer hover:border-primary/50 transition-all group">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-sm text-text-main group-hover:text-primary transition-colors">
            {title}
          </h4>
          {priority && (
            <Badge variant="outline" className={cn("text-xs", priorityColors[priority])}>
              {priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
            </Badge>
          )}
        </div>

        {description && (
          <p className="text-xs text-text-muted line-clamp-2">{description}</p>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {assignee && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
              {assignee.charAt(0)}
            </div>
            <span className="text-xs text-text-muted">{assignee}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

const KanbanBoard = ({ columns, className }) => {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div className="flex gap-6 p-1 min-w-max">
        {columns.map((column, index) => (
          <KanbanColumn
            key={index}
            title={column.title}
            items={column.items}
            count={column.items.length}
            color={column.color}
            onAddItem={() => console.log('添加任务')}
          />
        ))}
      </div>
    </div>
  );
};

export { KanbanBoard };
