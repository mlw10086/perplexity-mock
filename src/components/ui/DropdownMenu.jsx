import React from 'react';
import ReactDOM from 'react-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const DropdownMenu = ({ trigger, children, align = "end" }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0, right: 'auto' });
  const triggerRef = React.useRef(null);
  const menuRef = React.useRef(null);

  // 计算下拉菜单位置
  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const newPosition = {
        top: rect.bottom + window.scrollY + 8, // 8px gap
        left: align === "end" ? 'auto' : rect.left + window.scrollX,
        right: align === "end" ? window.innerWidth - rect.right - window.scrollX : 'auto',
      };
      setPosition(newPosition);
    }
  };

  // 打开菜单时更新位置
  React.useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [isOpen, align]);

  // 点击外部关闭
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <div className="inline-block" ref={triggerRef}>
        <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      </div>
      {isOpen && ReactDOM.createPortal(
        <AnimatePresence>
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 min-w-[200px] rounded-lg border border-border bg-surface shadow-lg py-1"
            style={{
              top: `${position.top}px`,
              left: position.left !== 'auto' ? `${position.left}px` : 'auto',
              right: position.right !== 'auto' ? `${position.right}px` : 'auto',
            }}
          >
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { onClick: () => { child.props.onClick?.(); setIsOpen(false); } });
              }
              return child;
            })}
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

const DropdownMenuItem = ({ children, onClick, icon: Icon, shortcut, className, ...props }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex w-full items-center gap-3 px-3 py-2 text-sm text-text-main hover:bg-surface-hover transition-colors outline-none cursor-pointer",
      className
    )}
    {...props}
  >
    {Icon && <Icon size={16} className="text-text-muted" />}
    <span className="flex-1 text-left">{children}</span>
    {shortcut && <span className="text-xs text-text-muted">{shortcut}</span>}
  </button>
);

const DropdownMenuSeparator = () => (
  <div className="my-1 h-px bg-border" />
);

const DropdownMenuLabel = ({ children, className }) => (
  <div className={cn("px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider", className)}>
    {children}
  </div>
);

export { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel };
