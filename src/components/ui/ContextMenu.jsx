import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ContextMenu = ({ children, items }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const menuRef = React.useRef(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  React.useEffect(() => {
    const handleClick = () => setIsOpen(false);
    const handleScroll = () => setIsOpen(false);

    if (isOpen) {
      document.addEventListener('click', handleClick);
      document.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  return (
    <>
      <div onContextMenu={handleContextMenu}>{children}</div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'fixed',
              top: position.y,
              left: position.x,
              zIndex: 9999,
            }}
            className="min-w-[200px] bg-surface border border-border rounded-lg shadow-xl py-1"
          >
            {items.map((item, index) => (
              <React.Fragment key={index}>
                {item.separator ? (
                  <div className="my-1 h-px bg-border" />
                ) : (
                  <button
                    onClick={() => {
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors text-left",
                      item.danger 
                        ? "text-red-500 hover:bg-red-500/10" 
                        : "text-text-main hover:bg-surface-hover"
                    )}
                  >
                    {item.icon && <item.icon size={16} />}
                    <span className="flex-1">{item.label}</span>
                    {item.shortcut && (
                      <span className="text-xs text-text-muted">{item.shortcut}</span>
                    )}
                  </button>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export { ContextMenu };
