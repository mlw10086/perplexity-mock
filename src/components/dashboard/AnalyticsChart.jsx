import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const data = [
  { name: '一月', value: 4000 },
  { name: '二月', value: 3000 },
  { name: '三月', value: 2000 },
  { name: '四月', value: 2780 },
  { name: '五月', value: 1890 },
  { name: '六月', value: 2390 },
  { name: '七月', value: 3490 },
];

const AnalyticsChart = () => {
  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>流量概览</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#13B9C4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#13B9C4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D2F2F" vertical={false} />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94A3B8', fontSize: 12 }} 
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94A3B8', fontSize: 12 }} 
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#202222', borderColor: '#2D2F2F', borderRadius: '8px', color: '#F1F5F9' }}
                itemStyle={{ color: '#13B9C4' }}
            />
            <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#13B9C4" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
