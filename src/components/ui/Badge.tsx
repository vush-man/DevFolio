import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  dot = true
}) => {
  const variantStyles = {
    neutral: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80',
    success: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/40',
    warning: 'text-amber-800 dark:text-amber-300 bg-amber-50/60 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/40',
    danger: 'text-rose-700 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-950/30 border-rose-200/80 dark:border-rose-800/40',
    info: 'text-sky-700 dark:text-sky-300 bg-sky-50/60 dark:bg-sky-950/30 border-sky-200/80 dark:border-sky-800/40'
  };

  const dotColors = {
    neutral: 'bg-slate-400 dark:bg-slate-500',
    success: 'bg-emerald-500 dark:bg-emerald-400',
    warning: 'bg-amber-500 dark:bg-amber-400',
    danger: 'bg-rose-500 dark:bg-rose-400',
    info: 'bg-sky-500 dark:bg-sky-400'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-1.5 py-0.5 gap-1.5 rounded-[4px] border',
    md: 'text-xs px-2 py-0.5 gap-1.5 rounded-[4px] border'
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-medium tracking-tight select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      <span>{children}</span>
    </span>
  );
};
