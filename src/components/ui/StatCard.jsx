import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from './Card';

const StatCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  className,
  prefix,
  suffix 
}) => {
  return (
    <Card className={cn("hover:border-primary/50 transition-all", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-text-muted">{title}</p>
          {Icon && (
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold text-text-main mb-1">
              {prefix}{value}{suffix}
            </div>
            {change && (
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend === 'up' ? "text-green-500" : "text-red-500"
              )}>
                {trend === 'up' ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <span>{change}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { StatCard };
