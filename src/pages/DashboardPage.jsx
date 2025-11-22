import React from 'react';
import { Search, ArrowRight, Clock, TrendingUp, MoreHorizontal, Globe } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const DashboardPage = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 animate-fade-in">
      
      {/* Hero Search Section */}
      <div className="flex flex-col items-center text-center space-y-6 py-10">
        <h1 className="font-display text-4xl md:text-5xl font-medium text-text-main">
          知识从这里开始
        </h1>
        <div className="w-full max-w-2xl relative">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-surface border border-border rounded-xl p-2 shadow-xl">
              <Search className="ml-3 text-text-muted" size={24} />
              <input 
                type="text" 
                placeholder="探索任何问题..." 
                className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-lg placeholder:text-text-muted/50 text-text-main"
              />
              <Button size="sm" className="rounded-lg">
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
             {['React 性能优化', 'Tailwind 技巧', '用户体验趋势', '仪表板布局'].map((tag) => (
               <span key={tag} className="px-3 py-1 rounded-full bg-surface hover:bg-surface-hover border border-border text-xs text-text-muted hover:text-text-main cursor-pointer transition-colors">
                 {tag}
               </span>
             ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-text-muted">
            <Clock size={18} />
            <span className="text-sm font-medium uppercase tracking-wider">最近活动</span>
          </div>
          <Button variant="ghost" size="sm">查看全部</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {[1, 2, 3].map((i) => (
             <Card key={i} className="group hover:border-primary/50 transition-colors cursor-pointer bg-surface/50">
               <CardHeader className="pb-3">
                 <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                   如何在 React 中实现复杂的过滤系统？
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-sm text-text-muted line-clamp-3">
                   要实现复杂的过滤系统，您应该考虑使用 reducer 模式来管理各种过滤器的状态...
                 </p>
                 <div className="mt-4 flex items-center gap-4 text-xs text-text-muted">
                    <span>2小时前</span>
                    <span className="flex items-center gap-1"><TrendingUp size={12}/> 1.2k 浏览</span>
                 </div>
               </CardContent>
             </Card>
           ))}
        </div>
      </div>

      {/* Discover Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2 text-text-muted">
            <Globe size={18} />
            <span className="text-sm font-medium uppercase tracking-wider">发现</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
               <div key={i} className="flex gap-4 p-4 rounded-xl bg-surface/30 border border-transparent hover:border-border transition-all cursor-pointer">
                  <div className="w-16 h-16 rounded-lg bg-surface-hover flex-shrink-0 flex items-center justify-center text-2xl">
                    {i === 1 ? '⚛️' : i === 2 ? '🎨' : i === 3 ? '🚀' : '💻'}
                  </div>
                  <div className="flex-1">
                     <h4 className="font-medium text-text-main mb-1">2024年十大 React 库</h4>
                     <p className="text-sm text-text-muted line-clamp-2">精选最重要的 React 库列表，助力提升开发效率。</p>
                     <div className="mt-2 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20"></div>
                        <span className="text-xs text-text-muted">科技日报</span>
                     </div>
                  </div>
               </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
