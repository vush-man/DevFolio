import React, { useState } from 'react';
import {
  Activity,
  Square,
  Pause,
  Play,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MetricCard } from '../../components/ui/MetricCard';
import { TelemetryChart } from '../../components/charts/TelemetryChart';
import { TestRun, TelemetryPoint, RunSummary, NavigationRoute } from '../../types';

export interface LiveMonitorViewProps {
  currentRun: TestRun | null;
  telemetry: TelemetryPoint[];
  summary: RunSummary | null;
  elapsedSeconds: number;
  totalDurationSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  onPauseToggle: () => void;
  onAbort: () => void;
  onNavigate: (route: NavigationRoute) => void;
}

export const LiveMonitorView: React.FC<LiveMonitorViewProps> = ({
  currentRun,
  telemetry,
  summary,
  elapsedSeconds,
  totalDurationSeconds,
  isRunning,
  isPaused,
  onPauseToggle,
  onAbort,
  onNavigate
}) => {
  const [chartMode, setChartMode] = useState<'latency' | 'throughput'>('latency');

  if (!currentRun && !isRunning) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <Activity className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
          No Active Test Run in Progress
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The telemetry monitoring cockpit activates as soon as a workload is launched from the test configuration wizard.
        </p>
        <Button
          size="md"
          variant="primary"
          onClick={() => onNavigate('create-test')}
          className="font-mono text-xs"
        >
          Launch New Test &rarr;
        </Button>
      </div>
    );
  }

  const latestPoint = telemetry.length > 0 ? telemetry[telemetry.length - 1] : null;
  const currentRps = latestPoint ? latestPoint.rps : (summary?.avgRps || 0);
  const currentVUs = latestPoint ? latestPoint.activeVus : (currentRun?.profile.concurrency || 0);
  const currentP95 = latestPoint ? latestPoint.p95Ms : (summary?.p95LatencyMs || 0);
  const currentP50 = latestPoint ? latestPoint.p50Ms : (summary?.p50LatencyMs || 0);
  const currentP99 = latestPoint ? latestPoint.p99Ms : (summary?.p99LatencyMs || 0);
  const currentErrorRate = latestPoint ? latestPoint.errorRate : (summary?.errorRatePercent || 0);

  const remainingSeconds = Math.max(0, totalDurationSeconds - elapsedSeconds);
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / Math.max(1, totalDurationSeconds)) * 100));

  return (
    <div className="space-y-6">
      {/* Cockpit Status Bar */}
      <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111722] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-7 h-7 rounded-[4px] flex items-center justify-center text-white ${
              isRunning ? (isPaused ? 'bg-amber-500' : 'bg-rose-500 animate-pulse') : 'bg-emerald-500'
            }`}>
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {currentRun?.name || 'Active Workload Stream'}
              </h1>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                isRunning
                  ? (isPaused ? 'text-amber-500 border-amber-500/40 bg-amber-500/10' : 'text-rose-500 border-rose-500/40 bg-rose-500/10')
                  : 'text-emerald-500 border-emerald-500/40 bg-emerald-500/10'
              }`}>
                [{isRunning ? (isPaused ? 'PAUSED' : 'RUNNING') : 'FINALIZED'}]
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              target: <span className="text-sky-600 dark:text-sky-400">{currentRun?.targetUrl}{currentRun?.profile.endpointPath}</span>
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          {isRunning ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={onPauseToggle}
                leftIcon={isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                className="text-xs font-mono"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={onAbort}
                leftIcon={<Square className="w-3.5 h-3.5" />}
                className="text-xs font-mono font-bold"
              >
                Stop / Abort
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onNavigate('results')}
                className="text-xs font-mono"
              >
                View Full Results
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => onNavigate('analysis')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="text-xs font-mono"
              >
                Inspect Bottlenecks
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar & Countdown */}
      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
          <span className="text-slate-600 dark:text-slate-300">
            Elapsed: <span className="font-bold text-slate-900 dark:text-slate-100">{elapsedSeconds}s</span> / {totalDurationSeconds}s
          </span>
          <span className="text-slate-500">
            {remainingSeconds > 0 ? `${remainingSeconds}s remaining` : 'Execution Completed'}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            style={{ width: `${progressPercent}%` }}
            className={`h-full transition-all duration-300 rounded-full ${
              isRunning ? 'bg-sky-500' : 'bg-emerald-500'
            }`}
          />
        </div>
      </div>

      {/* Live Telemetry Metric Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          label="Active Virtual Users"
          value={currentVUs}
          unit="VUs"
          subtext={`Cap: ${currentRun?.profile.concurrency || 0} concurrent`}
          icon={<Activity className="w-4 h-4" />}
          status="default"
        />

        <MetricCard
          label="Throughput (RPS)"
          value={currentRps}
          unit="req/s"
          subtext={`Total requests: ${summary?.totalRequests.toLocaleString() || 0}`}
          icon={<Zap className="w-4 h-4" />}
          status="nominal"
        />

        <MetricCard
          label="p95 Latency"
          value={currentP95}
          unit="ms"
          subtext={`p50: ${currentP50}ms | p99: ${currentP99}ms`}
          icon={<Clock className="w-4 h-4" />}
          status={currentP95 > 200 ? 'warning' : 'nominal'}
        />

        <MetricCard
          label="Error Rate"
          value={currentErrorRate}
          unit="%"
          subtext={`Failed: ${summary?.failedRequests || 0} calls`}
          icon={<AlertTriangle className="w-4 h-4" />}
          status={currentErrorRate > 2.0 ? 'critical' : 'nominal'}
        />
      </div>

      {/* Live Telemetry Chart */}
      <Card>
        <CardHeader
          title={chartMode === 'latency' ? 'Live Latency Percentiles (p50 / p95 / p99)' : 'Live Requests Per Second & HTTP Status'}
          subtitle="Updated in 1-second histogram reservoir windows"
          action={
            <div className="flex items-center gap-1.5 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono">
              <button
                onClick={() => setChartMode('latency')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  chartMode === 'latency'
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Latency Curves
              </button>
              <button
                onClick={() => setChartMode('throughput')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  chartMode === 'throughput'
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Throughput & Status
              </button>
            </div>
          }
        />
        <CardContent>
          <TelemetryChart
            data={telemetry}
            type={chartMode}
            height={260}
          />
        </CardContent>
      </Card>

      {/* Real-Time Event Log & Status Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Codes Split */}
        <Card className="lg:col-span-1">
          <CardHeader
            title="HTTP Status Breakdown"
            subtitle="Response distribution across workers"
          />
          <CardContent className="space-y-3 font-mono text-xs">
            {summary && Object.keys(summary.statusCodes).length > 0 ? (
              Object.entries(summary.statusCodes).map(([code, count]) => {
                const is2xx = code.startsWith('2');
                const is4xx = code.startsWith('4');
                const is5xx = code.startsWith('5');
                const percent = summary.totalRequests > 0
                  ? ((count / summary.totalRequests) * 100).toFixed(1)
                  : 0;

                return (
                  <div key={code} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${is2xx ? 'text-emerald-500' : is4xx ? 'text-amber-500' : 'text-rose-500'}`}>
                        HTTP {code}
                      </span>
                      <span className="text-slate-500">
                        {count.toLocaleString()} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className={`h-full ${is2xx ? 'bg-emerald-500' : is4xx ? 'bg-amber-500' : 'bg-rose-500'}`}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-slate-400 text-xs py-4 text-center">
                Awaiting first request response...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Event Stream */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Telemetry Event Timeline"
            subtitle="Asynchronous worker state changes and warning anomalies"
          />
          <CardContent className="p-0">
            <div className="h-48 overflow-y-auto p-4 space-y-2 font-mono text-xs bg-slate-900 text-slate-100 rounded-b-xl">
              {currentRun?.events && currentRun.events.length > 0 ? (
                currentRun.events.map((ev, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-slate-500 select-none text-[10px] pt-0.5">
                      {new Date(ev.timestampMs).toLocaleTimeString()}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-1 rounded ${
                        ev.type === 'error'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : ev.type === 'warn'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-sky-950 text-sky-400 border border-sky-800'
                      }`}
                    >
                      {ev.type}
                    </span>
                    <span className="text-slate-300 leading-tight">
                      {ev.message}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 text-[11px]">
                  Listening for worker stream telemetry events...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
