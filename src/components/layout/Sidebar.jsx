import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Library, Globe, Settings, Plus, User, BarChart2, Layers, Sun, Moon, Monitor, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/contexts/SettingsContext';

const SidebarItem = ({ icon: Icon, label, to, collapsed }) => {
  const [showLabel, setShowLabel] = React.useState(!collapsed);

  React.useEffect(() => {
    if (!collapsed) {
      const timer = setTimeout(() => setShowLabel(true), 150);
      return () => clearTimeout(timer);
    } else {
      setShowLabel(false);
    }
  }, [collapsed]);

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
          isActive 
            ? "bg-surface-hover text-primary" 
            : "text-text-muted hover:bg-surface-hover hover:text-text-main",
            collapsed && "justify-center px-2"
        )
      }
    >
      <Icon size={20} strokeWidth={2} />
      {showLabel && (
        <span className={cn(
          "font-medium text-sm whitespace-nowrap transition-opacity duration-200",
          !collapsed ? "opacity-100" : "opacity-0"
        )}>
          {label}
        </span>
      )}
    </NavLink>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const [showContent, setShowContent] = React.useState(true); // 控制内容显示
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();

  // 鼠标悬停时的展开状态
  const isExpanded = !collapsed || (settings.autoExpandSidebar && isHovering);

  // 延迟显示/隐藏内容，避免闪烁
  React.useEffect(() => {
    if (isExpanded) {
      // 展开时延迟显示内容
      const timer = setTimeout(() => setShowContent(true), 150);
      return () => clearTimeout(timer);
    } else {
      // 收起时立即隐藏内容
      setShowContent(false);
    }
  }, [isExpanded]);

  return (
    <aside 
      className={cn(
        "h-screen sticky top-0 border-r border-border bg-background flex flex-col py-6 transition-all duration-300 z-30",
        isExpanded ? "w-64" : "w-20"
      )}
      onMouseEnter={() => settings.autoExpandSidebar && collapsed && setIsHovering(true)}
      onMouseLeave={() => settings.autoExpandSidebar && collapsed && setIsHovering(false)}
    >
      {/* Logo Area */}
      <div className={cn("px-6 mb-8 flex items-center", !isExpanded ? "justify-center" : "justify-between")}>
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="font-display font-bold text-background text-xl">P</span>
            </div>
            {showContent && (
              <span className={cn(
                "font-display font-bold text-xl tracking-tight whitespace-nowrap overflow-hidden transition-opacity duration-200",
                isExpanded ? "opacity-100" : "opacity-0"
              )}>
                Perplex<span className="text-primary">UI</span>
              </span>
            )}
         </div>
         {showContent && (
           <button
             onClick={() => setCollapsed(true)}
             className={cn(
               "p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-main transition-all duration-200",
               isExpanded ? "opacity-100" : "opacity-0"
             )}
             title="收起侧边栏"
           >
             <ChevronLeft size={18} strokeWidth={2} />
           </button>
         )}
      </div>

      {/* Expand Button (when collapsed) */}
      {!isExpanded && (
        <div className="px-2 mb-6">
          <button
            onClick={() => setCollapsed(false)}
            className="w-full p-2 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-main transition-colors flex items-center justify-center"
            title="展开侧边栏"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>
      )}

      {/* New Action Button */}
      <div className={cn("px-4 mb-6", !isExpanded && "px-2")}>
        <Button 
          variant="primary" 
          className={cn("w-full flex gap-2 justify-center", !isExpanded && "px-0")}
          onClick={() => console.log("New Action")}
        >
          <Plus size={20} />
          {showContent && (
            <span className={cn(
              "transition-opacity duration-200 whitespace-nowrap",
              isExpanded ? "opacity-100" : "opacity-0"
            )}>
              新建项目
            </span>
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <SidebarItem icon={Home} label="首页" to="/dashboard" collapsed={!isExpanded} />
        <SidebarItem icon={Globe} label="发现" to="/discover" collapsed={!isExpanded} />
        <SidebarItem icon={Library} label="资料库" to="/library" collapsed={!isExpanded} />
        <div className="my-4 border-t border-border/50 mx-2" />
        <SidebarItem icon={BarChart2} label="分析" to="/analytics" collapsed={!isExpanded} />
        <SidebarItem icon={Layers} label="组件" to="/components" collapsed={!isExpanded} />
      </nav>

      {/* Bottom Actions */}
      <div className="px-4 mt-auto space-y-3">
        {/* 主题切换 */}
        <button
          onClick={toggleTheme}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full",
            "text-text-muted hover:bg-surface-hover hover:text-text-main",
            !isExpanded && "justify-center px-2"
          )}
          title={`切换主题 (当前: ${theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '系统'})`}
        >
          {theme === 'light' ? <Sun size={20} strokeWidth={2} /> : theme === 'dark' ? <Moon size={20} strokeWidth={2} /> : <Monitor size={20} strokeWidth={2} />}
          {showContent && (
            <span className={cn(
              "font-medium text-sm whitespace-nowrap transition-opacity duration-200",
              isExpanded ? "opacity-100" : "opacity-0"
            )}>
              {theme === 'light' ? '浅色模式' : theme === 'dark' ? '深色模式' : '跟随系统'}
            </span>
          )}
        </button>

        <SidebarItem icon={Settings} label="设置" to="/settings" collapsed={!isExpanded} />

        <div className={cn("flex items-center gap-3 p-2 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors cursor-pointer", !isExpanded && "justify-center p-0 border-0 bg-transparent")}>
           <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              张
           </div>
           {showContent && (
             <div className={cn(
               "flex-1 min-w-0 transition-opacity duration-200",
               isExpanded ? "opacity-100" : "opacity-0"
             )}>
               <p className="text-sm font-medium text-text-main truncate">张三</p>
               <p className="text-xs text-text-muted truncate">专业版</p>
             </div>
           )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
