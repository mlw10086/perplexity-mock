import React from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';

const CodeBlock = ({ code, language = "javascript", className }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group rounded-lg bg-surface border border-border overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-hover">
        <span className="text-xs font-medium text-text-muted uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs rounded hover:bg-surface transition-colors text-text-muted hover:text-text-main"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-500" />
              <span className="text-green-500">已复制</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>复制</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-text-main font-mono">{code}</code>
      </pre>
    </div>
  );
};

export { CodeBlock };
