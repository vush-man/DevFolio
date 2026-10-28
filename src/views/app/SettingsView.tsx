import React, { useState } from 'react';
import {
  Settings,
  User,
  ShieldCheck,
  Moon,
  Sun,
  Database,
  Trash2,
  Save,
  CheckCircle2,
  Key,
  Bell,
  Laptop
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { SystemSettings, ThemeMode } from '../../types';

export interface SettingsViewProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetData
}) => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [allowLocalhost, setAllowLocalhost] = useState(settings.allowLocalhostTesting);
  const [enforceSsrf, setEnforceSsrf] = useState(settings.enforceSsrfCheck);
  const [globalMaxVUs, setGlobalMaxVUs] = useState(settings.globalMaxVUs);
  const [globalDuration, setGlobalDuration] = useState(settings.globalMaxDurationSec);
  const [webhookUrl, setWebhookUrl] = useState(settings.notificationWebhook || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateUser({ name, email });
    }
    onUpdateSettings({
      ...settings,
      allowLocalhostTesting: allowLocalhost,
      enforceSsrfCheck: enforceSsrf,
      globalMaxVUs,
      globalMaxDurationSec: globalDuration,
      notificationWebhook: webhookUrl
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-mono">
            Platform & Account Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure safety thresholds, theme preferences, and developer workspace profiles.
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Appearance Settings */}
        <Card className="p-5">
          <CardHeader
            title="Appearance & Theme Mode"
            subtitle="Universal light and dark styling across all public and authenticated routes"
          />
          <CardContent className="pt-2">
            <div className="grid grid-cols-3 gap-3">
              {[
                { mode: 'light' as ThemeMode, label: 'Light', icon: <Sun className="w-4 h-4 text-amber-500" /> },
                { mode: 'dark' as ThemeMode, label: 'Dark', icon: <Moon className="w-4 h-4 text-sky-400" /> },
                { mode: 'system' as ThemeMode, label: 'System', icon: <Laptop className="w-4 h-4 text-slate-400" /> }
              ].map(opt => (
                <button
                  key={opt.mode}
                  type="button"
                  onClick={() => setTheme(opt.mode)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    theme === opt.mode
                      ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-300 font-semibold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.icon}
                  <span className="text-xs font-mono">{opt.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Developer Profile */}
        <Card className="p-5">
          <CardHeader
            title="Engineer Profile"
            subtitle="User identification and organizational role"
          />
          <CardContent className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 text-xs font-mono text-slate-500">
              <span>Assigned Role:</span>
              <Badge variant="info" size="sm">
                {user?.role.toUpperCase() || 'MEMBER'}
              </Badge>
              <span className="ml-4">Organization: {user?.organization || 'Open Infrastructure Lab'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Responsible Testing & Safety Clamps */}
        <Card className="p-5">
          <CardHeader
            title="Safety & Concurrency Limits"
            subtitle="Guardrails to prevent inadvertent denial of service or resource exhaustion"
          />
          <CardContent className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 font-mono">
                  Global Max Concurrency Ceiling (VUs)
                </label>
                <input
                  type="number"
                  min={5}
                  max={50}
                  value={globalMaxVUs}
                  onChange={e => setGlobalMaxVUs(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono"
                />
                <span className="text-[10px] text-slate-400">Hard limit on parallel browser worker loops</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 font-mono">
                  Global Test Duration Limit (Seconds)
                </label>
                <input
                  type="number"
                  min={10}
                  max={300}
                  value={globalDuration}
                  onChange={e => setGlobalDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono"
                />
                <span className="text-[10px] text-slate-400">Maximum allowable runtime per single test session</span>
              </div>
            </div>

            <div className="pt-2 space-y-2 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowLocalhost}
                  onChange={e => setAllowLocalhost(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Allow local development testing (<code className="font-mono text-sky-500">localhost:3000</code> / <code className="font-mono text-sky-500">127.0.0.1</code>)
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enforceSsrf}
                  onChange={e => setEnforceSsrf(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Enforce browser sandbox & pre-flight CORS safety verification
                </span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Data Management & Purge */}
        <Card className="p-5 border-rose-200 dark:border-rose-950/60 bg-rose-50/10">
          <CardHeader
            title="Local Data Management"
            subtitle="Purge historical test telemetry and reset pre-configured targets"
          />
          <CardContent className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-slate-500 max-w-md">
              DevFlow stores all test targets and historical runs in browser local storage. Resetting restores the initial DevFlow Core and public target presets.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetData}
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
              className="text-xs font-mono shrink-0 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600"
            >
              Reset Seed Data
            </Button>
          </CardContent>
        </Card>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            leftIcon={<Save className="w-4 h-4" />}
            className="font-mono"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
