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
      label: 'Targets & APIs',
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
      label: 'Live Monitor',
      icon: <Activity className="w-4 h-4 shrink-0" />,
      isPulse: isTestRunning
    },
    {
      id: 'results' as NavigationRoute,
      label: 'Run History',
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
      label: 'Audit Reports',
      icon: <FileText className="w-4 h-4 shrink-0" />
    },
    {
      id: 'comparisons' as NavigationRoute,
      label: 'Diff / Compare',
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
      className={`relative border-r border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#0B0F17] flex flex-col justify-between transition-all duration-150 shrink-0 select-none ${
        isCollapsed ? 'w-12 sm:w-14' : 'w-52 sm:w-56'
      }`}
    >
      {/* Top Nav Items */}
      <div className="p-2 space-y-0.5">
        <div className="flex items-center justify-between px-2 py-1.5 mb-1">
          {!isCollapsed && (
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
              DevFlow Studio
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors ml-auto"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {navItems.map(item => {
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[4px] text-xs font-mono transition-colors ${
                isActive
                  ? 'bg-slate-200/80 dark:bg-[#161F2E] text-sky-600 dark:text-sky-400 font-semibold border-l-2 border-sky-500 pl-2'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#121824] hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="relative">
                {item.icon}
                {item.isPulse && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                )}
              </div>

              {!isCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!isCollapsed && item.badge !== undefined && (
                <span className="text-[10px] font-mono text-slate-400">
                  [{item.badge}]
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="p-2.5 border-t border-slate-200 dark:border-slate-800/80 font-mono text-[11px] text-slate-400 dark:text-slate-500">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Sandbox OK</span>
            </span>
            <span className="text-[10px]">v1.0.4</span>
          </div>
        ) : (
          <div className="flex justify-center" title="DevFlow Sandbox OK">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
        )}
      </div>
    </aside>
  );
};
