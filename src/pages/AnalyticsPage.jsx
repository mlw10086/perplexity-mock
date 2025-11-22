import React from 'react';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowUp, ArrowDown, Users, Eye, Clock, Activity } from 'lucide-react';

const StatCard = ({ title, value, change, trend, icon: Icon }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-text-muted">{title}</p>
        {Icon && <Icon className="h-4 w-4 text-text-muted" />}
      </div>
      <div className="flex items-end justify-between pt-4">
          <div className="text-2xl font-bold text-text-main">{value}</div>
          <div className={`flex items-center text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span className="ml-1">{change}</span>
          </div>
      </div>
    </CardContent>
  </Card>
);

const AnalyticsPage = () => {
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">数据分析</h1>
        <div className="text-sm text-text-muted">最近 30 天</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="总用户数" value="12,345" change="+12%" trend="up" icon={Users} />
        <StatCard title="页面浏览量" value="1.2M" change="+8%" trend="up" icon={Eye} />
        <StatCard title="平均会话时长" value="4分32秒" change="-2%" trend="down" icon={Clock} />
        <StatCard title="跳出率" value="42.3%" change="-1%" trend="up" icon={Activity} />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <div className="col-span-4">
          <AnalyticsChart />
        </div>
        <div className="col-span-3 space-y-4">
           <Card className="h-full">
             <CardHeader>
               <CardTitle>流量来源</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 {[
                   { source: "直接访问", value: 40, color: "bg-primary" },
                   { source: "社交媒体", value: 25, color: "bg-blue-500" },
                   { source: "自然搜索", value: 20, color: "bg-green-500" },
                   { source: "推荐链接", value: 15, color: "bg-orange-500" },
                 ].map((item) => (
                   <div key={item.source} className="flex items-center">
                     <div className="w-24 text-sm text-text-muted">{item.source}</div>
                     <div className="flex-1 h-2 bg-surface-hover rounded-full overflow-hidden">
                       <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                     </div>
                     <div className="w-12 text-right text-sm font-medium">{item.value}%</div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
