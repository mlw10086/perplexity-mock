import React from 'react';
import { cn } from '@/lib/utils';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

const ChatMessage = ({ message, isOwn }) => {
  return (
    <div className={cn("flex gap-3 mb-4", isOwn && "flex-row-reverse")}>
      <Avatar fallback={message.sender.charAt(0)} className="flex-shrink-0" />
      <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-text-main">{message.sender}</span>
          <span className="text-xs text-text-muted">{message.time}</span>
        </div>
        <div className={cn(
          "rounded-2xl px-4 py-2 max-w-md",
          isOwn 
            ? "bg-primary text-white rounded-br-none" 
            : "bg-surface-hover text-text-main rounded-bl-none"
        )}>
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
    </div>
  );
};

const ChatInterface = ({ messages = [], onSendMessage, className }) => {
  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage?.(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className={cn("flex flex-col h-[600px] bg-surface border border-border rounded-xl overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-surface-hover">
        <Avatar fallback="对" />
        <div>
          <h3 className="font-medium text-text-main">对话</h3>
          <p className="text-xs text-text-muted">在线</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isOwn={message.isOwn}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-surface">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-surface-hover rounded-lg transition-colors">
            <Paperclip size={20} className="text-text-muted" />
          </button>
          <button className="p-2 hover:bg-surface-hover rounded-lg transition-colors">
            <Smile size={20} className="text-text-muted" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入消息..."
            className="flex-1 bg-surface-hover border-none outline-none px-4 py-2 rounded-lg text-sm text-text-main placeholder:text-text-muted/50"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-primary hover:bg-primary-hover rounded-lg transition-colors"
          >
            <Send size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export { ChatInterface };
