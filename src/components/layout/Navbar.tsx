import React from 'react';
import { Activity, Github, BookOpen, Users, Terminal, LogOut, User, LayoutDashboard } from 'lucide-react';
import { ThemeSelector } from '../ui/ThemeSelector';
import { Button } from '../ui/Button';
import { NavigationRoute } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export interface NavbarProps {
  currentRoute: NavigationRoute;
  onNavigate: (route: NavigationRoute) => void;
  isTestRunning?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate, isTestRunning }) => {
  const { user, isAuthenticated } = useAuth();
  const isAppView = [
    'dashboard', 'targets', 'create-test', 'monitor', 'results',
    'analysis', 'reports', 'comparisons', 'settings'
  ].includes(currentRoute);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-4 font-mono text-xs">
        {/* Brand / Logo */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-left group focus-visible:outline-none"
          >
            <div className="w-6 h-6 rounded-[4px] bg-sky-600 dark:bg-sky-500 flex items-center justify-center text-white font-bold text-xs">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-slate-100 tracking-tight text-sm">
                DevFlow
              </span>
              <span className="text-[10px] px-1 py-0.2 rounded border border-slate-300 dark:border-slate-700 text-slate-500">
                oss
              </span>
            </div>
          </button>

          {/* Navigation Links for Public Views */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('product')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                currentRoute === 'product'
                  ? 'text-sky-600 dark:text-sky-400 bg-slate-100 dark:bg-[#161F2E] font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Capabilities
            </button>
            <button
              onClick={() => onNavigate('docs')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                currentRoute === 'docs'
                  ? 'text-sky-600 dark:text-sky-400 bg-slate-100 dark:bg-[#161F2E] font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Documentation
            </button>
            <button
              onClick={() => onNavigate('community')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                currentRoute === 'community'
                  ? 'text-sky-600 dark:text-sky-400 bg-slate-100 dark:bg-[#161F2E] font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Community
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* GitHub Star Link */}
          <a
            href="https://github.com/adityasinghr651/Lab_Engineering"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="text-[11px]">Lab_Engineering</span>
          </a>

          {/* Theme Selector */}
          <ThemeSelector />

          {/* Running Test Pulse Indicator if active */}
          {isTestRunning && (
            <button
              onClick={() => onNavigate('monitor')}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-mono animate-pulse"
              title="Workload actively executing"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>TEST RUNNING</span>
            </button>
          )}

          {/* App Switcher or Public CTAs */}
          {isAppView ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate('landing')}
              className="text-xs font-mono"
            >
              Website
            </Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onNavigate('dashboard')}
              leftIcon={<LayoutDashboard className="w-3.5 h-3.5" />}
              className="font-mono text-xs"
            >
              Console
            </Button>
          )}

          {/* Auth Menu */}
          {isAuthenticated && user ? (
            <button
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-sky-500 transition-colors ml-1"
              title={`${user.name} (${user.role})`}
            >
              <div className="w-6 h-6 rounded-[3px] bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-[10px] text-sky-600 dark:text-sky-400 font-mono">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onNavigate('auth')}
              className="text-xs font-mono"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
