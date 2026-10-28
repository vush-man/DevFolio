import React, { useState, useEffect } from 'react';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  BarChart3,
  Server,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Github,
  BookOpen,
  HelpCircle,
  Play,
  Copy,
  Check,
  Database,
  Layers,
  Clock,
  Sliders
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { TelemetryChart } from '../../components/charts/TelemetryChart';
import { TelemetryPoint, NavigationRoute } from '../../types';

export const HomeView: React.FC<{ onNavigate: (route: NavigationRoute) => void }> = ({ onNavigate }) => {
  // Interactive Sandbox in Hero
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/devflow/health');
  const [concurrencyVUs, setConcurrencyVUs] = useState<number>(20);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [copiedInstall, setCopiedInstall] = useState<boolean>(false);

  // Live sandbox metrics
  const [sandboxPoints, setSandboxPoints] = useState<TelemetryPoint[]>([
    { timestampMs: 1000, second: 1, activeVus: 5, rps: 84, p50Ms: 11, p90Ms: 18, p95Ms: 24, p99Ms: 38, status2xx: 84, status4xx: 0, status5xx: 0, errorRate: 0 },
    { timestampMs: 2000, second: 2, activeVus: 10, rps: 142, p50Ms: 13, p90Ms: 21, p95Ms: 29, p99Ms: 44, status2xx: 142, status4xx: 0, status5xx: 0, errorRate: 0 },
    { timestampMs: 3000, second: 3, activeVus: 15, rps: 188, p50Ms: 14, p90Ms: 25, p95Ms: 34, p99Ms: 52, status2xx: 188, status4xx: 0, status5xx: 0, errorRate: 0 },
    { timestampMs: 4000, second: 4, activeVus: 20, rps: 224, p50Ms: 16, p90Ms: 28, p95Ms: 38, p99Ms: 61, status2xx: 224, status4xx: 0, status5xx: 0, errorRate: 0 },
    { timestampMs: 5000, second: 5, activeVus: 20, rps: 238, p50Ms: 15, p90Ms: 27, p95Ms: 37, p99Ms: 58, status2xx: 238, status4xx: 0, status5xx: 0, errorRate: 0 }
  ]);

  const [activeMetrics, setActiveMetrics] = useState({
    rps: 238,
    p50: 15,
    p95: 37,
    p99: 58,
    errors: 0
  });

  const handleRunDemoBenchmark = () => {
    setIsExecuting(true);
    let step = 0;
    const isHeavy = selectedEndpoint.includes('slow') || selectedEndpoint.includes('search');
    const isErrorProne = selectedEndpoint.includes('error');

    const interval = setInterval(() => {
      step++;
      const baseLatency = isHeavy ? 140 : 16;
      const jitter = Math.random() * 8;
      const p50 = Math.round(baseLatency + jitter);
      const p95 = Math.round(baseLatency * 1.8 + jitter * 2);
      const p99 = Math.round(baseLatency * 3.2 + jitter * 4);
      const rps = isHeavy ? Math.round(45 + Math.random() * 15) : Math.round(concurrencyVUs * 12 + Math.random() * 20);
      const errCount = isErrorProne ? Math.round(rps * 0.18) : 0;
      const errRate = isErrorProne ? 18.0 : 0.0;

      const newPoint: TelemetryPoint = {
        timestampMs: Date.now(),
        second: step,
        activeVus: Math.min(concurrencyVUs, Math.round((step / 3) * concurrencyVUs)),
        rps,
        p50Ms: p50,
        p90Ms: Math.round(p95 * 0.85),
        p95Ms: p95,
        p99Ms: p99,
        status2xx: rps - errCount,
        status4xx: 0,
        status5xx: errCount,
        errorRate: errRate
      };

      setSandboxPoints(prev => [...prev.slice(-14), newPoint]);
      setActiveMetrics({
        rps,
        p50,
        p95,
        p99,
        errors: errCount
      });

      if (step >= 8) {
        clearInterval(interval);
        setIsExecuting(false);
      }
    }, 700);
  };

  const copyCloneCmd = () => {
    navigator.clipboard.writeText('git clone https://github.com/adityasinghr651/Lab_Engineering.git && cd project && npm install');
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-[#E6EDF3] bg-grid-pattern">
      {/* 1. Technical Hero Section */}
      <section className="border-b border-slate-200 dark:border-slate-800/80 pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111722] text-[11px] font-mono text-slate-600 dark:text-slate-300 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>DevFlow Telemetry Studio &bull; v1.0.4 OSS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-mono">
            Empirical HTTP Load Testing &amp; Latency Telemetry.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-sans max-w-2xl">
            Simulate concurrent client traffic workloads, measure microsecond quantile latency curves (<span className="font-mono text-sky-600 dark:text-sky-400">p50, p95, p99</span>), and diagnose PostgreSQL connection pool exhaustion before shipping code.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs">
            <Button
              size="md"
              variant="primary"
              onClick={() => onNavigate('create-test')}
              leftIcon={<Play className="w-3.5 h-3.5" />}
            >
              Launch Load Studio
            </Button>
            <Button
              size="md"
              variant="secondary"
              onClick={() => onNavigate('dashboard')}
              leftIcon={<Activity className="w-3.5 h-3.5 text-sky-500" />}
            >
              Live Telemetry Console
            </Button>
            <Button
              size="md"
              variant="outline"
              onClick={() => onNavigate('docs')}
              leftIcon={<BookOpen className="w-3.5 h-3.5" />}
            >
              Docs &amp; Architecture
            </Button>
          </div>
        </div>

        {/* 2. Interactive Split-Pane Telemetry Workbench (Like Datadog / Grafana) */}
        <div className="rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111722] overflow-hidden shadow-xs">
          {/* Top terminal bar */}
          <div className="px-4 py-2.5 bg-slate-100/80 dark:bg-[#0E131D] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Terminal className="w-3.5 h-3.5 text-sky-500" />
              <span className="font-bold text-slate-900 dark:text-slate-200">workbench // devflow-worker-pool</span>
              <span className="text-slate-400">|</span>
              <span className="text-[11px] text-slate-500">engine: web-worker-fetch</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-500">
                Mode: {isExecuting ? 'DISPATCHING TRAFFIC' : 'IDLE / READY'}
              </span>
              <span className={`w-2 h-2 rounded-full ${isExecuting ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
            </div>
          </div>

          {/* Split Pane: Left Config / Right Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
            {/* Left Control Column (4 cols) */}
            <div className="lg:col-span-4 p-4 sm:p-5 space-y-4 bg-slate-50/50 dark:bg-[#0F141F]">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Workload Parameters
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 dark:text-slate-300 mb-1">
                  Target Endpoint
                </label>
                <select
                  value={selectedEndpoint}
                  onChange={e => setSelectedEndpoint(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161F2E] font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="/api/devflow/health">GET /api/devflow/health (Baseline 200)</option>
                  <option value="/api/devflow/search?q=pool">GET /api/devflow/search (DB Query)</option>
                  <option value="/api/devflow/slow">GET /api/devflow/slow (250ms Delay)</option>
                  <option value="/api/devflow/error-prone">GET /api/devflow/error-prone (5xx Injected)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Concurrency (VUs):</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">{concurrencyVUs} Workers</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={45}
                  value={concurrencyVUs}
                  onChange={e => setConcurrencyVUs(Number(e.target.value))}
                  className="w-full accent-sky-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>5 VUs</span>
                  <span>25 VUs</span>
                  <span>45 VUs</span>
                </div>
              </div>

              <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111722] text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Pacing Interval:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">35ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantile Reservoir:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">1,000 req/bucket</span>
                </div>
                <div className="flex justify-between">
                  <span>Timer Precision:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">0.1ms (DOMHighRes)</span>
                </div>
              </div>

              <Button
                size="md"
                variant="primary"
                onClick={handleRunDemoBenchmark}
                isLoading={isExecuting}
                className="w-full font-mono text-xs"
                leftIcon={<Play className="w-3.5 h-3.5" />}
              >
                {isExecuting ? 'Simulating Traffic...' : 'Execute Benchmark'}
              </Button>
            </div>

            {/* Right Telemetry Column (8 cols) */}
            <div className="lg:col-span-8 p-4 sm:p-5 flex flex-col justify-between">
              {/* Telemetry Gauge Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0E131D]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Throughput</span>
                  <span className="text-xl font-bold font-mono text-sky-600 dark:text-sky-400 tabular-nums">
                    {activeMetrics.rps} <span className="text-xs text-slate-500 font-normal">RPS</span>
                  </span>
                </div>

                <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0E131D]">
                  <span className="text-[10px] font-mono text-sky-500 uppercase block">p50 Median</span>
                  <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                    {activeMetrics.p50} <span className="text-xs text-slate-500 font-normal">ms</span>
                  </span>
                </div>

                <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0E131D]">
                  <span className="text-[10px] font-mono text-amber-500 uppercase block">p95 Percentile</span>
                  <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
                    {activeMetrics.p95} <span className="text-xs text-slate-500 font-normal">ms</span>
                  </span>
                </div>

                <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0E131D]">
                  <span className="text-[10px] font-mono text-rose-500 uppercase block">Tail (p99)</span>
                  <span className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
                    {activeMetrics.p99} <span className="text-xs text-slate-500 font-normal">ms</span>
                  </span>
                </div>
              </div>

              {/* Live SVG Graph */}
              <div className="flex-1 min-h-[190px]">
                <TelemetryChart
                  data={sandboxPoints}
                  type="latency"
                  height={190}
                />
              </div>

              {/* Status breakdown bar */}
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>200 OK</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>{activeMetrics.errors > 0 ? `${activeMetrics.errors} Failed (500)` : '0 Errors'}</span>
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('create-test')}
                  className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Advanced Wizard</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Technical Comparison Table: Why Guesswork Fails */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold">
            Methodology Comparison
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono mt-1">
            Single-Request Testing vs. Empirical Quantile Telemetry
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            API debugging tools like Postman and curl send isolated sequential requests. They cannot uncover concurrency starvation or database connection pool timeouts.
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111722]">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0E131D] text-slate-500 text-[11px] uppercase">
                <th className="p-3 pl-4">Engineering Metric</th>
                <th className="p-3">Single-Request (cURL / Postman)</th>
                <th className="p-3">Heavy Distributed Clusters</th>
                <th className="p-3 pr-4 text-sky-600 dark:text-sky-400 font-bold">DevFlow Performance Lab</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              <tr>
                <td className="p-3 pl-4 font-semibold text-slate-800 dark:text-slate-200 font-sans">
                  Tail Latency (p95 &amp; p99)
                </td>
                <td className="p-3 text-rose-600 dark:text-rose-400">
                  Not measured (Single sample only)
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-400">
                  Supported via heavy backend agents
                </td>
                <td className="p-3 pr-4 text-emerald-600 dark:text-emerald-400 font-bold">
                  Calculated live in 1s reservoir buckets
                </td>
              </tr>
              <tr>
                <td className="p-3 pl-4 font-semibold text-slate-800 dark:text-slate-200 font-sans">
                  Connection Pool Saturation
                </td>
                <td className="p-3 text-rose-600 dark:text-rose-400">
                  Invisible (0 concurrent load)
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-400">
                  Requires manual Datadog correlation
                </td>
                <td className="p-3 pr-4 text-emerald-600 dark:text-emerald-400 font-bold">
                  Auto-detected via queueing heuristic
                </td>
              </tr>
              <tr>
                <td className="p-3 pl-4 font-semibold text-slate-800 dark:text-slate-200 font-sans">
                  Setup Friction
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-400">
                  Zero setup, but zero concurrency
                </td>
                <td className="p-3 text-rose-600 dark:text-rose-400">
                  High (Kubernetes clusters, DSL scripts)
                </td>
                <td className="p-3 pr-4 text-emerald-600 dark:text-emerald-400 font-bold">
                  Zero-install browser studio + local proxy
                </td>
              </tr>
              <tr>
                <td className="p-3 pl-4 font-semibold text-slate-800 dark:text-slate-200 font-sans">
                  Regression Run Diffs
                </td>
                <td className="p-3 text-rose-600 dark:text-rose-400">
                  None
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-400">
                  Paid enterprise add-on
                </td>
                <td className="p-3 pr-4 text-emerald-600 dark:text-emerald-400 font-bold">
                  Native side-by-side delta calculator
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Six Deterministic Diagnostic Heuristics */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold">
            Automated Root Cause Diagnostics
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono mt-1">
            Deterministic Bottleneck Detection
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            DevFlow evaluates empirical telemetry against deterministic infrastructure heuristics to diagnose why servers degrade under load.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
              <Database className="w-4 h-4 text-rose-500" />
              <span>Pool Exhaustion &amp; Queue Delay</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Triggers when throughput plateaus while p95 latency escalates non-linearly (&gt;180% increase), indicative of PostgreSQL pool backlog.
            </p>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Tail Latency Disparity (p99/p50)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Detects cases where median response remains fast but p99 exceeds 3.8x baseline, isolating sporadic GC pauses or lock contention.
            </p>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>Cold-Start &amp; JIT Penalty</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Identifies initial 3-second initialization lag that resolves once DB connection handshakes and JIT caching stabilize.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. Audited Backend Quickstart & GitHub Link */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111722] p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                <Github className="w-4 h-4" />
                <span>adityasinghr651/Lab_Engineering</span>
              </div>
              <h2 className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
                Quickstart with the project/ Backend
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl font-sans">
                Clone the repository, start the Express backend in <code className="font-mono text-sky-500">project/</code>, and benchmark your local routes (<code className="font-mono text-xs">/api/devflow/*</code>).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 font-mono text-xs">
              <div className="px-3 py-2 rounded bg-slate-100 dark:bg-[#0E131D] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 truncate max-w-md">
                git clone https://github.com/adityasinghr651/Lab_Engineering.git
              </div>
              <Button
                size="md"
                variant="outline"
                onClick={copyCloneCmd}
                leftIcon={copiedInstall ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedInstall ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Technical Engineering FAQ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800/80">
        <h2 className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mb-6 text-center">
          Technical Architecture Questions
        </h2>
        <div className="space-y-3 font-mono text-xs">
          <Card className="p-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
              Q: How does the browser calculate accurate p95 and p99 without memory overhead?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              DevFlow partitions continuous execution into discrete 1-second histogram reservoir windows. Latencies are recorded with sub-millisecond precision via <code className="font-mono text-xs">performance.now()</code> and sorted per-window to extract exact quantile values.
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
              Q: Can I test external staging endpoints or only localhost?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              You can test any reachable HTTP/HTTPS API. For external APIs, standard CORS pre-flight rules apply. For development clusters, the integrated DevFlow server proxy relays requests to bypass cross-origin blocks.
            </p>
          </Card>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 text-xs font-mono text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">DevFlow</span>
            <span>&bull;</span>
            <span>Open-Source Performance Engineering Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('product')} className="hover:underline">Capabilities</button>
            <button onClick={() => onNavigate('docs')} className="hover:underline">Documentation</button>
            <button onClick={() => onNavigate('community')} className="hover:underline">GitHub Community</button>
            <button onClick={() => onNavigate('legal')} className="hover:underline">Safety Charter</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
