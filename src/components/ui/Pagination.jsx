import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  const pages = [];
  const maxVisible = 7;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }

  return (
    <nav className={cn("flex items-center gap-1", className)} aria-label="分页导航">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
          currentPage === 1
            ? "text-text-muted cursor-not-allowed opacity-50"
            : "text-text-main hover:bg-surface-hover"
        )}
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <div className="flex h-9 w-9 items-center justify-center text-text-muted">
              <MoreHorizontal size={18} />
            </div>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                page === currentPage
                  ? "bg-primary text-white"
                  : "text-text-main hover:bg-surface-hover"
              )}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
          currentPage === totalPages
            ? "text-text-muted cursor-not-allowed opacity-50"
            : "text-text-main hover:bg-surface-hover"
        )}
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
};

export { Pagination };
