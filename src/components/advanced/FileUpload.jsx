import React from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, File, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';

const FileUpload = ({ 
  accept, 
  multiple = false, 
  maxSize = 5 * 1024 * 1024, // 5MB
  onFilesChange,
  className 
}) => {
  const [files, setFiles] = React.useState([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef(null);

  const handleFiles = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => {
      if (file.size > maxSize) {
        alert(`文件 ${file.name} 超过最大限制 ${maxSize / 1024 / 1024}MB`);
        return false;
      }
      return true;
    });

    const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-text-muted mb-4" />
        <p className="text-sm font-medium text-text-main mb-1">
          点击上传或拖拽文件到此处
        </p>
        <p className="text-xs text-text-muted">
          {accept || '支持所有文件格式'} · 最大 {maxSize / 1024 / 1024}MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors"
            >
              {file.type.startsWith('image/') ? (
                <ImageIcon size={20} className="text-primary flex-shrink-0" />
              ) : (
                <File size={20} className="text-text-muted flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-main truncate">{file.name}</p>
                <p className="text-xs text-text-muted">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <button
                onClick={() => handleRemove(index)}
                className="flex-shrink-0 p-1 hover:bg-surface-hover rounded transition-colors"
              >
                <X size={16} className="text-text-muted" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { FileUpload };
