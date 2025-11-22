import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sheet = ({ open, onOpenChange, children, side = "right" }) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const animations = {
    left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
    top: { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "-100%" } },
    bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  };

  const sideClasses = {
    left: "left-0 top-0 h-full w-3/4 max-w-sm",
    right: "right-0 top-0 h-full w-3/4 max-w-sm",
    top: "top-0 left-0 right-0 h-auto max-h-[85vh]",
    bottom: "bottom-0 left-0 right-0 h-auto max-h-[85vh]",
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            {...animations[side]}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={cn(
              "fixed z-50 bg-surface shadow-2xl overflow-y-auto",
              sideClasses[side]
            )}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SheetContent = ({ className, children, onClose }) => (
  <div className={cn("relative h-full flex flex-col", className)}>
    <button
      onClick={onClose}
      className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
    >
      <X className="h-5 w-5" />
    </button>
    {children}
  </div>
);

const SheetHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-2 p-6", className)} {...props} />
);

const SheetTitle = ({ className, ...props }) => (
  <h2 className={cn("text-lg font-display font-semibold", className)} {...props} />
);

const SheetDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-text-muted", className)} {...props} />
);

const SheetFooter = ({ className, ...props }) => (
  <div className={cn("flex items-center justify-end gap-2 p-6 border-t border-border mt-auto", className)} {...props} />
);

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter };
