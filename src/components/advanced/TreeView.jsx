import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';

const TreeNode = ({ node, level = 0 }) => {
  const [isOpen, setIsOpen] = React.useState(node.defaultOpen || false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors group",
          node.active && "bg-primary/10"
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown size={16} className="text-text-muted flex-shrink-0" />
          ) : (
            <ChevronRight size={16} className="text-text-muted flex-shrink-0" />
          )
        ) : (
          <span className="w-4" />
        )}

        {node.icon ? (
          <node.icon size={16} className={cn("flex-shrink-0", node.active ? "text-primary" : "text-text-muted")} />
        ) : hasChildren ? (
          <Folder size={16} className="text-text-muted flex-shrink-0" />
        ) : (
          <File size={16} className="text-text-muted flex-shrink-0" />
        )}

        <span className={cn("text-sm", node.active ? "text-primary font-medium" : "text-text-main")}>
          {node.label}
        </span>

        {node.badge && (
          <span className="ml-auto text-xs text-text-muted bg-surface-hover px-1.5 py-0.5 rounded">
            {node.badge}
          </span>
        )}
      </div>

      {hasChildren && isOpen && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeView = ({ data, className }) => {
  return (
    <div className={cn("w-full", className)}>
      {data.map((node, index) => (
        <TreeNode key={index} node={node} />
      ))}
    </div>
  );
};

export { TreeView };
