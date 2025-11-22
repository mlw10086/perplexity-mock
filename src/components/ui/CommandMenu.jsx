import React from 'react';
import { cn } from '@/lib/utils';
import { Search, Command, X } from 'lucide-react';
import { Dialog, DialogContent } from './Dialog';

const CommandMenu = ({ open, onOpenChange, children }) => {
  const [search, setSearch] = React.useState('');

  // ESC 键关闭
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  // 重置搜索框当对话框关闭时
  React.useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="flex items-center border-b border-border px-4">
          <Search className="mr-2 h-5 w-5 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索命令..."
            className="flex h-14 w-full bg-transparent py-3 text-sm outline-none placeholder:text-text-muted/50"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <kbd className="pointer-events-none hidden h-6 select-none items-center gap-1 rounded border border-border bg-surface-hover px-2 text-[10px] font-medium text-text-muted sm:flex">
              ESC
            </kbd>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-1.5 hover:bg-surface-hover text-text-muted hover:text-text-main transition-colors"
              title="关闭"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto p-2">
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { search, onClose: () => onOpenChange(false) });
            }
            return child;
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CommandGroup = ({ heading, children, search, onClose }) => {
  const filteredChildren = React.Children.toArray(children).filter(child => {
    if (!search || !React.isValidElement(child)) return true;
    const label = child.props.children?.toString().toLowerCase() || '';
    return label.includes(search.toLowerCase());
  });

  if (filteredChildren.length === 0) return null;

  return (
    <div className="mb-4">
      {heading && (
        <div className="px-2 py-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
          {heading}
        </div>
      )}
      <div className="space-y-1">
        {React.Children.map(filteredChildren, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { onClose });
          }
          return child;
        })}
      </div>
    </div>
  );
};

const CommandItem = ({ children, onSelect, icon: Icon, shortcut, className, onClose }) => {
  const handleClick = () => {
    onSelect?.();
    onClose?.(); // 执行选择后自动关闭命令面板
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-main hover:bg-surface-hover transition-colors cursor-pointer outline-none",
        className
      )}
    >
      {Icon && <Icon size={18} className="text-text-muted" />}
      <span className="flex-1 text-left">{children}</span>
      {shortcut && (
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-surface-hover px-1.5 text-[10px] font-medium text-text-muted">
          {shortcut}
        </kbd>
      )}
    </button>
  );
};

export { CommandMenu, CommandGroup, CommandItem };
