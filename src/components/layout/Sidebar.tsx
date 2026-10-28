import React from 'react';
import {
  LayoutDashboard,
  Server,
  PlayCircle,
  Activity,
  History,
  AlertTriangle,
  FileText,
  GitCompare,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { NavigationRoute } from '../../types';

export interface SidebarProps {
  currentRoute: NavigationRoute;
  onNavigate: (route: NavigationRoute) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isTestRunning?: boolean;
  activeTargetsCount?: number;
  totalRunsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isTestRunning = false,
  activeTargetsCount = 3,
  totalRunsCount = 2
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavigationRoute,
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />
    },
    {
      id: 'targets' as NavigationRoute,
      label: 'Servers & Targets',
      icon: <Server className="w-4 h-4 shrink-0" />,
      badge: activeTargetsCount > 0 ? activeTargetsCount : undefined
    },
    {
      id: 'create-test' as NavigationRoute,
      label: 'Create Test',
      icon: <PlayCircle className="w-4 h-4 shrink-0 text-sky-500" />,
      highlight: true
    },
    {
      id: 'monitor' as NavigationRoute,
      label: 'Live Monitoring',
      icon: <Activity className="w-4 h-4 shrink-0" />,
      isPulse: isTestRunning
    },
    {
      id: 'results' as NavigationRoute,
      label: 'Test Runs',
      icon: <History className="w-4 h-4 shrink-0" />,
      badge: totalRunsCount > 0 ? totalRunsCount : undefined
    },
    {
      id: 'analysis' as NavigationRoute,
      label: 'Bottlenecks',
      icon: <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
    },
    {
      id: 'reports' as NavigationRoute,
      label: 'Reports & Export',
      icon: <FileText className="w-4 h-4 shrink-0" />
    },
    {
      id: 'comparisons' as NavigationRoute,
      label: 'Comparisons',
      icon: <GitCompare className="w-4 h-4 shrink-0" />
    },
    {
      id: 'docs' as NavigationRoute,
      label: 'Documentation',
      icon: <BookOpen className="w-4 h-4 shrink-0" />
    },
    {
      id: 'settings' as NavigationRoute,
      label: 'Settings',
      icon: <Settings className="w-4 h-4 shrink-0" />
    }
  ];

  return (
    <aside
      className={`relative border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#090D16]/50 flex flex-col justify-between transition-all duration-200 shrink-0 ${
        isCollapsed ? 'w-14 sm:w-16' : 'w-56 sm:w-60'
      }`}
    >
      {/* Top Nav Items */}
      <div className="p-2 sm:p-3 space-y-1">
        <div className="flex items-center justify-between px-2 py-1.5 mb-2">
          {!isCollapsed && (
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
              Engineering Console
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-auto"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {navItems.map(item => {
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors select-none ${
                isActive
                  ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200/80 dark:border-sky-800/80'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              } ${item.highlight && !isActive ? 'hover:border-sky-500/30' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="relative">
                {item.icon}
                {item.isPulse && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </div>

              {!isCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!isCollapsed && item.badge !== undefined && (
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80">
        {!isCollapsed ? (
          <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safe Sandbox Active</span>
            </div>
            <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
              DevFlow Engine v1.0.4-oss
            </p>
          </div>
        ) : (
          <div className="flex justify-center" title="DevFlow Engine v1.0.4-oss">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
        )}
      </div>
    </aside>
  );
};
