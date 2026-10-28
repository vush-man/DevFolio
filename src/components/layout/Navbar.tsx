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
  const { user, isAuthenticated, logout } = useAuth();
  const isAppView = [
    'dashboard', 'targets', 'create-test', 'monitor', 'results',
    'analysis', 'reports', 'comparisons', 'settings'
  ].includes(currentRoute);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-[#090D16]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-600 dark:bg-sky-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 dark:text-slate-50 tracking-tight text-base font-mono">
                  DevFlow
                </span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded border border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40">
                  OSS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none hidden sm:block">
                Performance Lab
              </p>
            </div>
          </button>

          {/* Navigation Links for Public Views */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('product')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currentRoute === 'product'
                  ? 'text-sky-600 dark:text-sky-400 bg-slate-100 dark:bg-slate-800/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
              }`}
            >
              Platform
            </button>
            <button
              onClick={() => onNavigate('docs')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                currentRoute === 'docs'
                  ? 'text-sky-600 dark:text-sky-400 bg-slate-100 dark:bg-slate-800/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Docs</span>
            </button>
            <button
              onClick={() => onNavigate('community')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                currentRoute === 'community'
                  ? 'text-sky-600 dark:text-sky-400 bg-slate-100 dark:bg-slate-800/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Community</span>
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* GitHub Star Link */}
          <a
            href="https://github.com/adityasinghr651/Lab_Engineering"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">Lab_Engineering</span>
          </a>

          {/* Theme Selector */}
          <ThemeSelector />

          {/* Running Test Pulse Indicator if active */}
          {isTestRunning && (
            <button
              onClick={() => onNavigate('monitor')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono animate-pulse"
              title="Workload actively executing"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="hidden sm:inline font-semibold">LOAD TEST ACTIVE</span>
            </button>
          )}

          {/* App Switcher or Public CTAs */}
          {isAppView ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate('landing')}
              className="text-xs"
            >
              Website
            </Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onNavigate('dashboard')}
              leftIcon={<LayoutDashboard className="w-3.5 h-3.5" />}
            >
              Open Console
            </Button>
          )}

          {/* Auth Menu */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={() => onNavigate('settings')}
                className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200 hover:text-sky-500 transition-colors"
                title={`${user.name} (${user.role})`}
              >
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-[10px] text-sky-600 dark:text-sky-400">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onNavigate('auth')}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
