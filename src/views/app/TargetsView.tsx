import React, { useState } from 'react';
import {
  Server,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Trash2,
  Play,
  Activity,
  Key,
  Globe,
  RefreshCw
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { TestTarget, TargetEnvironment, NavigationRoute } from '../../types';

export interface TargetsViewProps {
  targets: TestTarget[];
  onAddTarget: (target: TestTarget) => void;
  onDeleteTarget: (targetId: string) => void;
  onNavigate: (route: NavigationRoute) => void;
  onSelectTargetForTest: (target: TestTarget) => void;
}

export const TargetsView: React.FC<TargetsViewProps> = ({
  targets,
  onAddTarget,
  onDeleteTarget,
  onNavigate,
  onSelectTargetForTest
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [testingTargetId, setTestingTargetId] = useState<string | null>(null);
  const [pingResult, setPingResult] = useState<Record<string, { status: number; latencyMs: number; error?: string }>>({});

  // New Target Form State
  const [name, setName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [environment, setEnvironment] = useState<TargetEnvironment>('development');
  const [description, setDescription] = useState('');
  const [healthEndpoint, setHealthEndpoint] = useState('/health');
  const [authType, setAuthType] = useState<'none' | 'bearer' | 'apiKey'>('none');
  const [authToken, setAuthToken] = useState('');
  const [authHeader, setAuthHeader] = useState('Authorization');
  const [maxVUs, setMaxVUs] = useState(25);
  const [maxRps, setMaxRps] = useState(150);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isVerifyingInForm, setIsVerifyingInForm] = useState(false);
  const [formVerificationSuccess, setFormVerificationSuccess] = useState<boolean | null>(null);

  // Ping verification
  const handleVerifyConnection = async (target: TestTarget) => {
    setTestingTargetId(target.id);
    const start = performance.now();
    const endpoint = target.healthEndpoint || '/health';
    const cleanBase = target.baseUrl.replace(/\/+$/, '');
    const cleanPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${cleanBase}${cleanPath}`;

    try {
      const headers: Record<string, string> = { ...target.defaultHeaders };
      if (target.authConfig?.type === 'bearer' && target.authConfig.token) {
        headers['Authorization'] = `Bearer ${target.authConfig.token}`;
      }

      const res = await fetch(url, { method: 'GET', headers });
      const duration = Math.round(performance.now() - start);
      setPingResult(prev => ({
        ...prev,
        [target.id]: { status: res.status, latencyMs: duration }
      }));
    } catch (err: any) {
      const duration = Math.round(performance.now() - start);
      setPingResult(prev => ({
        ...prev,
        [target.id]: { status: 0, latencyMs: duration, error: err.message || 'Connection failed' }
      }));
    } finally {
      setTestingTargetId(null);
    }
  };

  const handleFormTestPing = async () => {
    if (!baseUrl) {
      setFormError('Please enter a target base URL.');
      return;
    }
    setFormError(null);
    setIsVerifyingInForm(true);
    setFormVerificationSuccess(null);

    const cleanBase = baseUrl.replace(/\/+$/, '');
    const cleanPath = healthEndpoint.startsWith('/') ? healthEndpoint : `/${healthEndpoint}`;
    const url = `${cleanBase}${cleanPath}`;

    try {
      const res = await fetch(url);
      if (res.ok || res.status === 200 || res.status === 404) {
        setFormVerificationSuccess(true);
      } else {
        setFormVerificationSuccess(false);
        setFormError(`Server returned status HTTP ${res.status}`);
      }
    } catch (err: any) {
      setFormVerificationSuccess(false);
      setFormError(`Unable to reach endpoint: ${err.message}. If testing localhost, ensure CORS is enabled or use DevFlow proxy.`);
    } finally {
      setIsVerifyingInForm(false);
    }
  };

  const handleCreateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Target name is required.');
      return;
    }
    if (!baseUrl.trim()) {
      setFormError('Target base URL is required.');
      return;
    }
    if (!isAuthorized) {
      setFormError('You must explicitly verify that you are authorized to test this target.');
      return;
    }

    const newTarget: TestTarget = {
      id: `target-${Date.now().toString(36)}`,
      name: name.trim(),
      baseUrl: baseUrl.trim(),
      environment,
      description: description.trim() || 'Custom user testing target',
      healthEndpoint: healthEndpoint.trim() || '/health',
      isVerified: true,
      createdAt: new Date().toISOString(),
      defaultHeaders: {
        'Content-Type': 'application/json'
      },
      authConfig: authType !== 'none' ? {
        type: authType,
        token: authToken,
        headerName: authHeader
      } : undefined,
      limits: {
        maxConcurrency: Math.min(maxVUs, 50),
        maxRps: Math.min(maxRps, 300),
        maxDurationSeconds: 120
      }
    };

    onAddTarget(newTarget);
    setIsAddModalOpen(false);

    // Reset form
    setName('');
    setBaseUrl('');
    setDescription('');
    setIsAuthorized(false);
    setFormVerificationSuccess(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-mono">
            Servers & API Targets
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage authorized test environments, health check endpoints, and safe concurrency ceilings.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Register New Target
        </Button>
      </div>

      {/* Target Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {targets.map(target => {
          const ping = pingResult[target.id];
          const isVerifying = testingTargetId === target.id;

          return (
            <Card key={target.id} className="p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                    {target.name}
                  </span>
                  <Badge
                    variant={
                      target.environment === 'production'
                        ? 'danger'
                        : target.environment === 'staging'
                        ? 'warning'
                        : 'info'
                    }
                    size="sm"
                  >
                    {target.environment}
                  </Badge>
                </div>

                <p className="text-xs font-mono text-sky-600 dark:text-sky-400 truncate mb-2">
                  {target.baseUrl}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {target.description}
                </p>

                {/* Health Check Status */}
                <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs mb-4">
                  <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                    <span className="text-slate-500">Health Probe:</span>
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                      {target.healthEndpoint || '/health'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-slate-500">Connectivity:</span>
                    {ping ? (
                      ping.status > 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          HTTP {ping.status} ({ping.latencyMs}ms)
                        </span>
                      ) : (
                        <span className="text-rose-500 font-bold">Failed</span>
                      )
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400">Verified</span>
                    )}
                  </div>
                </div>

                {/* Safe Limits */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="block text-[10px] text-slate-400">Max VUs:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {target.limits.maxConcurrency}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">Max Throughput:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {target.limits.maxRps} RPS
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleVerifyConnection(target)}
                  isLoading={isVerifying}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Ping
                </Button>

                <div className="flex items-center gap-2">
                  {targets.length > 1 && (
                    <button
                      onClick={() => onDeleteTarget(target.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded transition-colors"
                      title="Delete target"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      onSelectTargetForTest(target);
                      onNavigate('create-test');
                    }}
                    leftIcon={<Play className="w-3 h-3" />}
                    className="text-xs font-mono"
                  >
                    Test
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Target Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Authorized Testing Target"
        subtitle="Configure target server, probe path, and safe testing limits"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateTarget} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {formVerificationSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Target responded successfully to health probe ping!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. User Auth Microservice"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Environment
              </label>
              <select
                value={environment}
                onChange={e => setEnvironment(e.target.value as TargetEnvironment)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="development">Development (Local)</option>
                <option value="staging">Staging / Preview</option>
                <option value="production">Production (Strict Limits)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Base URL *
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={baseUrl}
                onChange={e => setBaseUrl(e.target.value)}
                placeholder="http://localhost:3000 or https://api.mycluster.org"
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleFormTestPing}
                isLoading={isVerifyingInForm}
                className="text-xs font-mono shrink-0"
              >
                Verify URL
              </Button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              For local testing, enter http://localhost:3000 or relative paths to use the built-in dev proxy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Health Probe Endpoint
              </label>
              <input
                type="text"
                value={healthEndpoint}
                onChange={e => setHealthEndpoint(e.target.value)}
                placeholder="/health or /api/health"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Authentication
              </label>
              <select
                value={authType}
                onChange={e => setAuthType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="none">None (Public API)</option>
                <option value="bearer">Bearer Token (JWT)</option>
                <option value="apiKey">Custom API Key Header</option>
              </select>
            </div>
          </div>

          {authType === 'bearer' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Bearer Token
              </label>
              <input
                type="password"
                value={authToken}
                onChange={e => setAuthToken(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>
          )}

          {authType === 'apiKey' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Header Name
                </label>
                <input
                  type="text"
                  value={authHeader}
                  onChange={e => setAuthHeader(e.target.value)}
                  placeholder="X-API-Key"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  API Key Secret
                </label>
                <input
                  type="password"
                  value={authToken}
                  onChange={e => setAuthToken(e.target.value)}
                  placeholder="Secret key"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* Safety Clamps */}
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-3">
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              <span>Concurrency & Throughput Clamps</span>
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  Max Virtual Users (Ceiling: 50)
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={maxVUs}
                  onChange={e => setMaxVUs(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  Max RPS Cap
                </label>
                <input
                  type="number"
                  min={10}
                  max={300}
                  value={maxRps}
                  onChange={e => setMaxRps(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Authorization Checkbox */}
          <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={isAuthorized}
                onChange={e => setIsAuthorized(e.target.checked)}
                className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
              />
              <span className="text-amber-900 dark:text-amber-300 leading-relaxed">
                I hereby certify and confirm that I own, operate, or have explicit authorization to execute performance and load tests against this target server.
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!isAuthorized}
            >
              Save & Register Target
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
