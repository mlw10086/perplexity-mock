import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// 获取系统主题偏好
const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// 获取实际应用的主题（处理 system 模式）
const getResolvedTheme = (theme) => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

// 立即应用主题，避免闪烁
const applyTheme = (theme) => {
  const root = window.document.documentElement;
  const resolvedTheme = getResolvedTheme(theme);
  
  // 移除之前的主题类
  root.classList.remove('light', 'dark');
  
  // 添加当前主题类
  root.classList.add(resolvedTheme);
  
  // 同时更新 data 属性
  root.setAttribute('data-theme', resolvedTheme);
  root.setAttribute('data-theme-mode', theme); // 保存原始模式（包括 system）
  
  // 保存到 localStorage
  localStorage.setItem('theme', theme);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // 从 localStorage 读取主题设置，默认为 'system'
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || 'system';
    
    // 立即应用主题，避免闪烁
    applyTheme(initialTheme);
    
    return initialTheme;
  });

  // 监听系统主题变化
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyTheme('system');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      return 'light';
    });
  };

  // 获取当前实际显示的主题
  const resolvedTheme = getResolvedTheme(theme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
