import React from 'react';
import { Card } from './Card';

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  trend?: {
    value: string;
    isPositive?: boolean; // Positive in engineering might mean lower latency or higher throughput depending on context
    isNeutral?: boolean;
  };
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  status?: 'nominal' | 'warning' | 'critical' | 'default';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  subtext,
  trend,
  icon,
  badge,
  status = 'default',
  className = ''
}) => {
  const statusBorder = {
    default: 'border-slate-200 dark:border-slate-800',
    nominal: 'border-l-4 border-l-emerald-500 border-slate-200 dark:border-slate-800',
    warning: 'border-l-4 border-l-amber-500 border-slate-200 dark:border-slate-800',
    critical: 'border-l-4 border-l-rose-500 border-slate-200 dark:border-slate-800'
  };

  return (
    <Card className={`p-4 transition-all ${statusBorder[status]} ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          {badge}
          {icon && <span className="text-slate-400 dark:text-slate-500">{icon}</span>}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 font-mono">
            {unit}
          </span>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          {subtext && <span>{subtext}</span>}
          {trend && (
            <span
              className={`font-mono font-medium ${
                trend.isNeutral
                  ? 'text-slate-500'
                  : trend.isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
