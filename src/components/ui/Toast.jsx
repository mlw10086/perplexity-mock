import React from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = React.useCallback((toast) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
    
    if (toast.duration !== Infinity) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration || 3000);
    }
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const variants = {
    success: { icon: CheckCircle, className: "bg-green-500/10 border-green-500/20 text-green-500" },
    error: { icon: AlertCircle, className: "bg-red-500/10 border-red-500/20 text-red-500" },
    warning: { icon: AlertTriangle, className: "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" },
    info: { icon: Info, className: "bg-primary/10 border-primary/20 text-primary" },
  };

  const config = variants[toast.variant || 'info'];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm w-full",
        config.className
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <div className="flex-1">
        {toast.title && <h4 className="font-semibold mb-1">{toast.title}</h4>}
        {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
      </div>
      <button onClick={onClose} className="flex-shrink-0 opacity-70 hover:opacity-100">
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
