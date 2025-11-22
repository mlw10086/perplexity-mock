import React from 'react';
import { cn } from '@/lib/utils';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ onSearch, suggestions = [], recentSearches = [], className }) => {
  const [query, setQuery] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      setQuery(searchQuery);
      setShowDropdown(false);
    }
  };

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      <div className={cn(
        "relative flex items-center bg-surface border border-border rounded-xl transition-all",
        isFocused && "ring-2 ring-primary/50 border-primary"
      )}>
        <Search className="ml-4 text-text-muted" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setShowDropdown(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setShowDropdown(false), 200);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder="搜索任何内容..."
          className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm text-text-main placeholder:text-text-muted/50"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="mr-4 p-1 hover:bg-surface-hover rounded transition-colors"
          >
            <X size={18} className="text-text-muted" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (query || recentSearches.length > 0 || suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2 w-full bg-surface border border-border rounded-xl shadow-xl overflow-hidden"
          >
            {query && suggestions.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-text-muted uppercase">建议</div>
                {suggestions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(item)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-hover transition-colors text-left"
                  >
                    <TrendingUp size={16} className="text-text-muted" />
                    <span className="text-sm text-text-main">{item}</span>
                  </button>
                ))}
              </div>
            )}

            {!query && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-text-muted uppercase">最近搜索</div>
                {recentSearches.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(item)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-hover transition-colors text-left"
                  >
                    <Clock size={16} className="text-text-muted" />
                    <span className="text-sm text-text-main">{item}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { SearchBar };
