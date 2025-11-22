import React from 'react';
import { cn } from '@/lib/utils';

const ColorPicker = ({ value = "#13B9C4", onChange, presets = [], className }) => {
  const [localValue, setLocalValue] = React.useState(value);
  const [showPicker, setShowPicker] = React.useState(false);

  const defaultPresets = [
    '#13B9C4', '#3B82F6', '#8B5CF6', '#EC4899', 
    '#F59E0B', '#10B981', '#EF4444', '#6B7280'
  ];

  const colors = presets.length > 0 ? presets : defaultPresets;

  const handleChange = (newColor) => {
    setLocalValue(newColor);
    onChange?.(newColor);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-10 h-10 rounded-lg border-2 border-border hover:border-primary transition-colors shadow-sm"
          style={{ backgroundColor: localValue }}
        />
        <input
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 h-10 px-3 rounded-lg border border-border bg-surface text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="#13B9C4"
        />
      </div>

      {showPicker && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowPicker(false)} />
          <div className="absolute z-20 mt-2 p-4 bg-surface border border-border rounded-lg shadow-xl space-y-3">
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    handleChange(color);
                    setShowPicker(false);
                  }}
                  className={cn(
                    "w-10 h-10 rounded-lg border-2 transition-all hover:scale-110",
                    localValue === color ? "border-white ring-2 ring-primary" : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={localValue}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full h-10 cursor-pointer rounded-lg"
            />
          </div>
        </>
      )}
    </div>
  );
};

export { ColorPicker };
