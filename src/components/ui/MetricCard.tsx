import React from 'react';
import { Card } from './Card';

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
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
  const statusDot = {
    default: 'bg-slate-400',
    nominal: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-rose-500'
  };

  return (
    <Card className={`p-3.5 hover:border-slate-300 dark:hover:border-slate-700/80 transition-colors ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot[status]}`} />
          <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {label}
          </span>
        </div>
        {icon && <span className="text-slate-400 dark:text-slate-500 text-xs">{icon}</span>}
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
            {unit}
          </span>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
          {subtext && <span className="truncate">{subtext}</span>}
          {trend && (
            <span
              className={`shrink-0 ml-2 font-medium ${
                trend.isNeutral
                  ? 'text-slate-400'
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
