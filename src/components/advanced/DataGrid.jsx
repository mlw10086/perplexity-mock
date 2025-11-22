import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, ArrowUpDown, Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

const DataGrid = ({ columns, data, className }) => {
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const filteredData = React.useMemo(() => {
    return data.filter((row) =>
      columns.some((col) =>
        String(row[col.key]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, columns]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex items-center gap-4">
        <Input
          icon={Search}
          placeholder="搜索..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
        <Badge variant="outline">
          共 {sortedData.length} 条记录
        </Badge>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-hover">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-left text-sm font-medium text-text-muted",
                      col.sortable && "cursor-pointer hover:text-text-main transition-colors select-none"
                    )}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {col.sortable && (
                        <div className="flex flex-col">
                          {sortConfig.key === col.key ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp size={14} className="text-primary" />
                            ) : (
                              <ChevronDown size={14} className="text-primary" />
                            )
                          ) : (
                            <ArrowUpDown size={14} className="opacity-50" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-surface-hover/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-text-main">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-text-muted">
            第 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedData.length)} 条，共 {sortedData.length} 条
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-border hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              上一页
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-border hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { DataGrid };
