import React from 'react';
import ReactDOM from 'react-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Popover = ({ trigger, children, position = "bottom" }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef(null);
  const popoverRef = React.useRef(null);

  // 计算弹出框位置
  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let newPos = { top: 0, left: 0 };

      switch (position) {
        case 'top':
          newPos = {
            top: rect.top + window.scrollY - 8,
            left: rect.left + window.scrollX + rect.width / 2,
          };
          break;
        case 'bottom':
          newPos = {
            top: rect.bottom + window.scrollY + 8,
            left: rect.left + window.scrollX + rect.width / 2,
          };
          break;
        case 'left':
          newPos = {
            top: rect.top + window.scrollY + rect.height / 2,
            left: rect.left + window.scrollX - 8,
          };
          break;
        case 'right':
          newPos = {
            top: rect.top + window.scrollY + rect.height / 2,
            left: rect.right + window.scrollX + 8,
          };
          break;
      }
      setPos(newPos);
    }
  };

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
  }, [isOpen, position]);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const transformClasses = {
    top: '-translate-x-1/2 -translate-y-full',
    bottom: '-translate-x-1/2',
    left: '-translate-x-full -translate-y-1/2',
    right: '-translate-y-1/2',
  };

  return (
    <>
      <div className="inline-block" ref={triggerRef}>
        <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      </div>
      {isOpen && ReactDOM.createPortal(
        <AnimatePresence>
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "fixed z-50 rounded-lg border border-border bg-surface shadow-lg p-4",
              transformClasses[position]
            )}
            style={{
              top: `${pos.top}px`,
              left: `${pos.left}px`,
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export { Popover };
