import React, { useState } from 'react';
import {
  PlayCircle,
  Server,
  Zap,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Settings2,
  Layers,
  Code2,
  Sliders,
  Check,
  Activity
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TestTarget, TestType, WorkloadProfile, NavigationRoute } from '../../types';

export interface CreateTestViewProps {
  targets: TestTarget[];
  selectedTarget?: TestTarget;
  onLaunchTest: (profile: WorkloadProfile, target: TestTarget) => void;
  onNavigate: (route: NavigationRoute) => void;
}

export const CreateTestView: React.FC<CreateTestViewProps> = ({
  targets,
  selectedTarget,
  onLaunchTest,
  onNavigate
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Wizard state
  const [targetId, setTargetId] = useState<string>(selectedTarget?.id || targets[0]?.id || '');
  const [testType, setTestType] = useState<TestType>('load');
  const [endpointPath, setEndpointPath] = useState<string>('/api/devflow/health');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [concurrency, setConcurrency] = useState<number>(15);
  const [durationSeconds, setDurationSeconds] = useState<number>(20);
  const [rampUpSeconds, setRampUpSeconds] = useState<number>(5);
  const [pacingMs, setPacingMs] = useState<number>(40);
  const [requestHeadersJson, setRequestHeadersJson] = useState<string>('{\n  "Accept": "application/json"\n}');
  const [requestBody, setRequestBody] = useState<string>('{\n  "benchmark": true\n}');
  const [p95ThresholdMs, setP95ThresholdMs] = useState<number>(150);
  const [maxErrorRate, setMaxErrorRate] = useState<number>(1.0);
  const [safetyConfirmed, setSafetyConfirmed] = useState<boolean>(false);
  const [stepError, setStepError] = useState<string | null>(null);

  const activeTarget = targets.find(t => t.id === targetId) || targets[0];

  // Helper calculations
  const estimatedRequests = Math.round((concurrency * durationSeconds * 1000) / Math.max(10, pacingMs + 20));

  const validateStep = (step: number): boolean => {
    setStepError(null);
    if (step === 1) {
      if (!targetId || !activeTarget) {
        setStepError('Please select a valid target environment.');
        return false;
      }
    } else if (step === 3) {
      if (!endpointPath.trim()) {
        setStepError('Endpoint path cannot be empty.');
        return false;
      }
      try {
        JSON.parse(requestHeadersJson);
      } catch {
        setStepError('Custom headers must be valid JSON format.');
        return false;
      }
      if (concurrency < 1 || concurrency > 50) {
        setStepError('Concurrency must be between 1 and 50 Virtual Users.');
        return false;
      }
      if (durationSeconds < 5 || durationSeconds > 120) {
        setStepError('Test duration must be between 5 and 120 seconds.');
        return false;
      }
    } else if (step === 4) {
      if (!safetyConfirmed) {
        setStepError('You must review and explicitly confirm target safety authorization.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setStepError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleLaunch = () => {
    if (!validateStep(4)) return;

    let parsedHeaders = {};
    try {
      parsedHeaders = JSON.parse(requestHeadersJson);
    } catch {
      // ignore
    }

    const profile: WorkloadProfile = {
      targetId: activeTarget.id,
      testType,
      endpointPath: endpointPath.trim(),
      method,
      concurrency,
      durationSeconds,
      rampUpSeconds,
      requestHeaders: parsedHeaders,
      requestBody: method !== 'GET' ? requestBody : undefined,
      pacingMs,
      thresholds: {
        p95LatencyMs: p95ThresholdMs > 0 ? p95ThresholdMs : undefined,
        maxErrorRatePercent: maxErrorRate >= 0 ? maxErrorRate : undefined
      }
    };

    onLaunchTest(profile, activeTarget);
  };

  // Step indicator names
  const steps = [
    { num: 1, label: 'Select Target' },
    { num: 2, label: 'Test Pattern' },
    { num: 3, label: 'Workload Tuning' },
    { num: 4, label: 'Safety Review' },
    { num: 5, label: 'Review & Arm' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-mono">
          Configure Performance Workload
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Define concurrency models, target endpoint paths, pacing, and service-level thresholds.
        </p>
      </div>

      {/* Stepper Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 overflow-x-auto">
        {steps.map((s, idx) => {
          const isDone = currentStep > s.num;
          const isCurrent = currentStep === s.num;
          return (
            <div key={s.num} className="flex items-center gap-2 shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span
                className={`text-xs font-medium ${
                  isCurrent
                    ? 'text-slate-900 dark:text-slate-100 font-semibold'
                    : isDone
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {s.label}
              </span>
              {idx < steps.length - 1 && (
                <div className="w-8 h-0.5 bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1" />
              )}
            </div>
          );
        })}
      </div>

      {/* Error message alert */}
      {stepError && (
        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{stepError}</span>
        </div>
      )}

      {/* STEP 1: Select Target */}
      {currentStep === 1 && (
        <Card className="p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Step 1: Choose Authorized Target
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select one of your registered environments or inspect endpoint connectivity.
            </p>
          </div>

          <div className="space-y-3">
            {targets.map(t => (
              <label
                key={t.id}
                className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  targetId === t.id
                    ? 'border-sky-500 bg-sky-50/40 dark:bg-sky-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="targetSelection"
                    checked={targetId === t.id}
                    onChange={() => setTargetId(t.id)}
                    className="mt-1 text-sky-600 focus:ring-sky-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 font-mono">
                        {t.name}
                      </span>
                      <Badge variant={t.isVerified ? 'success' : 'warning'} size="sm">
                        {t.environment}
                      </Badge>
                    </div>
                    <p className="text-xs font-mono text-sky-600 dark:text-sky-400 mt-0.5">
                      {t.baseUrl}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {t.description}
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono text-slate-400 hidden sm:block">
                  <div>Probe: {t.healthEndpoint}</div>
                  <div>Max: {t.limits.maxConcurrency} VUs</div>
                </div>
              </label>
            ))}
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
            <span>Need to add a different server?</span>
            <button
              onClick={() => onNavigate('targets')}
              className="text-sky-600 dark:text-sky-400 hover:underline font-mono"
            >
              + Register New Target
            </button>
          </div>
        </Card>
      )}

      {/* STEP 2: Choose Test Type */}
      {currentStep === 2 && (
        <Card className="p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Step 2: Choose Test Pattern
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Standard workload profiles simulating various user concurrency distributions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Load Test */}
            <div
              onClick={() => { setTestType('load'); setConcurrency(15); setDurationSeconds(25); setRampUpSeconds(5); }}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                testType === 'load'
                  ? 'border-sky-500 bg-sky-50/30 dark:bg-[#161F2E]'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2 font-mono">
                  <Activity className="w-4 h-4 text-sky-500" />
                  <span>Load Test (Nominal)</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-500">[READY]</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2.5">
                Smooth ramp-up followed by sustained steady-state traffic to verify normal performance targets.
              </p>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Default: 15 VUs &bull; 25s &bull; 5s ramp
              </div>
            </div>

            {/* Stress Test */}
            <div
              onClick={() => { setTestType('stress'); setConcurrency(35); setDurationSeconds(35); setRampUpSeconds(8); }}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                testType === 'stress'
                  ? 'border-sky-500 bg-sky-50/30 dark:bg-[#161F2E]'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2 font-mono">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Stress Test (Capacity Cliff)</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-500">[READY]</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2.5">
                Aggressive concurrency climb designed to push past nominal capacity and locate the saturation breaking point.
              </p>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Default: 35 VUs &bull; 35s &bull; 8s ramp
              </div>
            </div>

            {/* Spike Test */}
            <div
              onClick={() => { setTestType('spike'); setConcurrency(40); setDurationSeconds(20); setRampUpSeconds(1); }}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                testType === 'spike'
                  ? 'border-sky-500 bg-sky-50/30 dark:bg-[#161F2E]'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2 font-mono">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Spike Test (Instant Surge)</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-rose-500">[READY]</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2.5">
                Immediate instantaneous traffic surge to test server autoscaling responsiveness and queue buffers.
              </p>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Default: 40 VUs &bull; 20s &bull; 1s ramp
              </div>
            </div>

            {/* Soak Test */}
            <div
              onClick={() => { setTestType('soak'); setConcurrency(10); setDurationSeconds(60); setRampUpSeconds(5); }}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                testType === 'soak'
                  ? 'border-sky-500 bg-sky-50/30 dark:bg-[#161F2E]'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2 font-mono">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span>Soak Test (Endurance)</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-indigo-500">[READY]</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2.5">
                Sustained baseline traffic over extended duration to detect slow memory leaks and resource depletion.
              </p>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Default: 10 VUs &bull; 60s &bull; 5s ramp
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 3: Configure Workload */}
      {currentStep === 3 && (
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Step 3: Workload Tuning & Parameters
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tune concurrency, endpoint paths, method payloads, and latency SLO expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Method
              </label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono font-bold"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Endpoint Path *
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-lg text-slate-500 font-mono">
                  {activeTarget.baseUrl}
                </span>
                <input
                  type="text"
                  required
                  value={endpointPath}
                  onChange={e => setEndpointPath(e.target.value)}
                  placeholder="/api/devflow/health"
                  className="flex-1 px-3 py-2 text-xs rounded-r-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Quick preset endpoints for DevFlow local target */}
          {activeTarget.id === 'target-devflow-local' && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-[11px] text-slate-400">Presets:</span>
              <button
                type="button"
                onClick={() => { setEndpointPath('/api/devflow/health'); setMethod('GET'); }}
                className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px]"
              >
                /health (nominal)
              </button>
              <button
                type="button"
                onClick={() => { setEndpointPath('/api/devflow/search?name=test'); setMethod('GET'); }}
                className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px]"
              >
                /search (database query)
              </button>
              <button
                type="button"
                onClick={() => { setEndpointPath('/api/devflow/slow'); setMethod('GET'); }}
                className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-amber-500"
              >
                /slow (250ms synthetic delay)
              </button>
              <button
                type="button"
                onClick={() => { setEndpointPath('/api/devflow/error-prone'); setMethod('GET'); }}
                className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-rose-500"
              >
                /error-prone (5xx rate testing)
              </button>
            </div>
          )}

          {/* Workload Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Virtual Users (VUs)</span>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{concurrency}</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                value={concurrency}
                onChange={e => setConcurrency(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
              <span className="text-[10px] text-slate-400">Concurrent parallel workers</span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Duration</span>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{durationSeconds}s</span>
              </div>
              <input
                type="range"
                min={5}
                max={120}
                value={durationSeconds}
                onChange={e => setDurationSeconds(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
              <span className="text-[10px] text-slate-400">Test execution window</span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Ramp-Up</span>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{rampUpSeconds}s</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={rampUpSeconds}
                onChange={e => setRampUpSeconds(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
              <span className="text-[10px] text-slate-400">Time to reach target VUs</span>
            </div>
          </div>

          {/* Thresholds & SLOs */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-3">
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-mono">
              <Sliders className="w-3.5 h-3.5 text-sky-500" />
              <span>Service Level Objective (SLO) Thresholds</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  p95 Latency Goal (Max ms)
                </label>
                <input
                  type="number"
                  min={10}
                  max={5000}
                  value={p95ThresholdMs}
                  onChange={e => setP95ThresholdMs(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  Max Error Tolerance (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={100}
                  value={maxErrorRate}
                  onChange={e => setMaxErrorRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 4: Safety Review */}
      {currentStep === 4 && (
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <span>Step 4: Safety & Traffic Impact Review</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verify traffic volume, host isolation, and confirm authorization before executing workload.
            </p>
          </div>

          {/* Traffic Estimation Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-mono">Target Host</span>
              <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 font-mono truncate block">
                {activeTarget.name}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-mono">Max Concurrency</span>
              <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 font-mono">
                {concurrency} Active VUs
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-mono">Duration</span>
              <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 font-mono">
                {durationSeconds} Seconds
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-mono">Est. Request Volume</span>
              <span className="font-bold text-xs text-sky-600 dark:text-sky-400 font-mono">
                ~{estimatedRequests.toLocaleString()} Calls
              </span>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-xs text-amber-800 dark:text-amber-300 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Potential Service Impact Warning</span>
            </div>
            <p className="leading-relaxed">
              High-concurrency testing may deplete backend database connection pools, saturate CPU, or trigger upstream cloud rate-limits. Ensure this target is not handling critical user production traffic during stress periods.
            </p>
          </div>

          {/* Explicit Confirmation Checkbox */}
          <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={safetyConfirmed}
                onChange={e => setSafetyConfirmed(e.target.checked)}
                className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
              <span className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                I acknowledge the estimated traffic volume and certify that I am explicitly authorized to perform this {testType.toUpperCase()} test on <span className="font-mono text-sky-600 dark:text-sky-400">{activeTarget.baseUrl}</span>.
              </span>
            </label>
          </div>
        </Card>
      )}

      {/* STEP 5: Review & Arm */}
      {currentStep === 5 && (
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-emerald-500" />
              <span>Step 5: Review Configuration & Launch Test</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Double check the finalized execution profile before opening the live telemetry cockpit.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden font-mono text-xs">
            <div className="bg-slate-100 dark:bg-slate-900/80 p-3 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
              Workload Specification Snapshot
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 p-4 space-y-2 bg-white dark:bg-[#0F172A]">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Target Server:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{activeTarget.name} ({activeTarget.baseUrl})</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Endpoint & Method:</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">{method} {endpointPath}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Test Pattern:</span>
                <span className="font-bold uppercase text-slate-900 dark:text-slate-100">{testType} Test</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Concurrency (VUs):</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{concurrency} Virtual Users</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Duration & Ramp:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{durationSeconds}s (ramp: {rampUpSeconds}s)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">SLO p95 Threshold:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">&lt; {p95ThresholdMs}ms</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Target armed. Clicking &ldquo;Launch Workload&rdquo; will initiate live real-time network requests.</span>
            </span>
          </div>
        </Card>
      )}

      {/* Navigation Wizard Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        {currentStep > 1 ? (
          <Button
            size="md"
            variant="outline"
            onClick={handleBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>
        ) : (
          <Button
            size="md"
            variant="ghost"
            onClick={() => onNavigate('dashboard')}
          >
            Cancel
          </Button>
        )}

        {currentStep < 5 ? (
          <Button
            size="md"
            variant="primary"
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Continue
          </Button>
        ) : (
          <Button
            size="lg"
            variant="primary"
            onClick={handleLaunch}
            leftIcon={<PlayCircle className="w-4 h-4" />}
            className="font-mono font-bold"
          >
            Launch Workload Now
          </Button>
        )}
      </div>
    </div>
  );
};
