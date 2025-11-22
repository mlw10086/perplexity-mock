import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Tabs = ({ defaultValue, className, children }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <div className={cn("w-full", className)}>
       {React.Children.map(children, child => {
         if (React.isValidElement(child)) {
            return React.cloneElement(child, { activeTab, setActiveTab });
         }
         return child;
       })}
    </div>
  );
};

const TabsList = ({ className, children, activeTab, setActiveTab }) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-surface p-1 text-text-muted", className)}>
    {React.Children.map(children, child => {
         if (React.isValidElement(child)) {
            return React.cloneElement(child, { activeTab, setActiveTab });
         }
         return child;
       })}
  </div>
);

const TabsTrigger = ({ value, className, children, activeTab, setActiveTab }) => {
    const isActive = activeTab === value;
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative z-10",
                isActive ? "text-text-main" : "text-text-muted hover:text-text-main",
                className
            )}
            onClick={() => setActiveTab(value)}
        >
            {isActive && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-surface-hover rounded-md -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
            {children}
        </button>
    );
};

const TabsContent = ({ value, className, children, activeTab }) => {
    if (activeTab !== value) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}
        >
            {children}
        </motion.div>
    );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
