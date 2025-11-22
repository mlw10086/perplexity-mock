import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = ({ selected, onSelect, className }) => {
  const [currentDate, setCurrentDate] = React.useState(selected || new Date());
  const [viewDate, setViewDate] = React.useState(selected || new Date());

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setCurrentDate(newDate);
    onSelect?.(newDate);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(viewDate);
  const days = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    return (
      day === currentDate.getDate() &&
      viewDate.getMonth() === currentDate.getMonth() &&
      viewDate.getFullYear() === currentDate.getFullYear()
    );
  };

  return (
    <div className={cn("w-full max-w-sm bg-surface border border-border rounded-xl p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-surface-hover rounded transition-colors">
          <ChevronLeft size={20} className="text-text-muted" />
        </button>
        <h3 className="font-medium text-text-main">
          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
        </h3>
        <button onClick={handleNextMonth} className="p-1 hover:bg-surface-hover rounded transition-colors">
          <ChevronRight size={20} className="text-text-muted" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-text-muted py-2">
            {day}
          </div>
        ))}

        {days.map((day, index) => (
          <div key={index} className="aspect-square">
            {day ? (
              <button
                onClick={() => handleDateClick(day)}
                className={cn(
                  "w-full h-full rounded-lg text-sm transition-all hover:bg-surface-hover",
                  isSelected(day) && "bg-primary text-white hover:bg-primary",
                  isToday(day) && !isSelected(day) && "border border-primary text-primary",
                  !isSelected(day) && !isToday(day) && "text-text-main"
                )}
              >
                {day}
              </button>
            ) : (
              <div />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { Calendar };
