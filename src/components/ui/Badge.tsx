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
    neutral: 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/60',
    success: 'text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40',
    warning: 'text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40',
    danger: 'text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40',
    info: 'text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-900/60 bg-sky-50/70 dark:bg-sky-950/40'
  };

  const dotColors = {
    neutral: 'bg-slate-400 dark:bg-slate-500',
    success: 'bg-emerald-500 dark:bg-emerald-400',
    warning: 'bg-amber-500 dark:bg-amber-400',
    danger: 'bg-rose-500 dark:bg-rose-400',
    info: 'bg-sky-500 dark:bg-sky-400'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1.5 rounded',
    md: 'text-xs px-2.5 py-1 gap-1.5 rounded-md'
  };

  return (
    <span
      className={`inline-flex items-center font-medium border font-mono tracking-tight select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      <span>{children}</span>
    </span>
  );
};
