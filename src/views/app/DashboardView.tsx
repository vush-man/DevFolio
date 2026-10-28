import React from 'react';
import {
  Activity,
  PlayCircle,
  Server,
  Zap,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  GitCompare,
  FileText,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { MetricCard } from '../../components/ui/MetricCard';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TestTarget, TestRun, NavigationRoute } from '../../types';

export interface DashboardViewProps {
  targets: TestTarget[];
  runs: TestRun[];
  onNavigate: (route: NavigationRoute) => void;
  onSelectRun: (run: TestRun) => void;
  isTestRunning: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  targets,
  runs,
  onNavigate,
  onSelectRun,
  isTestRunning
}) => {
  const totalRuns = runs.length;
  const completedRuns = runs.filter(r => r.status === 'completed');
  const avgThroughput = completedRuns.length > 0
    ? Math.round(completedRuns.reduce((acc, r) => acc + r.summary.avgRps, 0) / completedRuns.length)
    : 0;

  const avgP95 = completedRuns.length > 0
    ? Math.round(completedRuns.reduce((acc, r) => acc + r.summary.p95LatencyMs, 0) / completedRuns.length)
    : 0;

  const totalErrors = runs.reduce((acc, r) => acc + r.summary.failedRequests, 0);
  const totalRequests = runs.reduce((acc, r) => acc + r.summary.totalRequests, 0);
  const globalErrorRate = totalRequests > 0 ? Number(((totalErrors / totalRequests) * 100).toFixed(2)) : 0;

  return (
    <div className="space-y-5">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono">
              Telemetry &amp; Workload Overview
            </h1>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-slate-500">
              workspace: default
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
            Aggregate load testing telemetry, target health probes, and diagnostic findings across test sessions.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate('targets')}
            leftIcon={<Server className="w-3.5 h-3.5" />}
          >
            Targets ({targets.length})
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onNavigate('create-test')}
            leftIcon={<PlayCircle className="w-3.5 h-3.5" />}
          >
            New Test Run
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          label="Total Test Runs"
          value={totalRuns}
          subtext={`${completedRuns.length} completed sessions`}
          icon={<Activity className="w-4 h-4" />}
          status="nominal"
        />

        <MetricCard
          label="Avg Throughput"
          value={avgThroughput}
          unit="RPS"
          subtext="Empirical requests/sec"
          trend={{ value: "+18% vs baseline", isPositive: true }}
          icon={<Zap className="w-4 h-4" />}
          status="default"
        />

        <MetricCard
          label="Mean p95 Latency"
          value={avgP95}
          unit="ms"
          subtext="Target SLO: <150ms"
          trend={{ value: avgP95 > 200 ? "Breached" : "Nominal", isPositive: avgP95 <= 200 }}
          icon={<Clock className="w-4 h-4" />}
          status={avgP95 > 200 ? "warning" : "nominal"}
        />

        <MetricCard
          label="Global Error Rate"
          value={globalErrorRate}
          unit="%"
          subtext={`${totalErrors.toLocaleString()} failures recorded`}
          icon={<AlertTriangle className="w-4 h-4" />}
          status={globalErrorRate > 3.0 ? "critical" : "nominal"}
        />
      </div>

      {/* Technical Status Strip */}
      <div className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111722] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>DevFlow Local Core Target: HTTP 200 OK</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
          <span className="text-slate-500 hidden sm:inline">Probe: /api/devflow/health</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('create-test')}
            className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Execute Load Test</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Two-Column Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Runs Table (2 cols) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Workload Execution History"
              subtitle="Latest empirical benchmark sessions with quantile breakdowns"
              action={
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onNavigate('results')}
                  className="text-xs font-mono"
                >
                  View All
                </Button>
              }
            />
            <CardContent className="p-0">
              {runs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-mono">
                  No test runs recorded yet. Launch your first test.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0E131D] text-[10px] text-slate-500 uppercase">
                        <th className="p-2.5 pl-4">Session &amp; Target</th>
                        <th className="p-2.5">Pattern</th>
                        <th className="p-2.5 text-right">Throughput</th>
                        <th className="p-2.5 text-right">p95</th>
                        <th className="p-2.5 text-right">Errors</th>
                        <th className="p-2.5 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {runs.slice(0, 5).map(run => (
                        <tr
                          key={run.id}
                          className="hover:bg-slate-50 dark:hover:bg-[#161F2E]/60 transition-colors"
                        >
                          <td className="p-2.5 pl-4 font-sans">
                            <button
                              onClick={() => { onSelectRun(run); onNavigate('results'); }}
                              className="font-semibold text-slate-900 dark:text-slate-100 hover:text-sky-500 text-left block truncate max-w-xs text-xs"
                            >
                              {run.name}
                            </button>
                            <span className="text-[11px] font-mono text-slate-500 block truncate">
                              {run.targetName} &bull; {run.profile.endpointPath}
                            </span>
                          </td>
                          <td className="p-2.5">
                            <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                              {run.profile.testType}
                            </span>
                          </td>
                          <td className="p-2.5 text-right tabular-nums font-medium text-slate-900 dark:text-slate-100">
                            {run.summary.avgRps} <span className="text-[10px] text-slate-400">RPS</span>
                          </td>
                          <td className="p-2.5 text-right tabular-nums font-medium">
                            <span
                              className={
                                run.summary.p95LatencyMs > 250
                                  ? 'text-rose-600 dark:text-rose-400 font-bold'
                                  : 'text-slate-900 dark:text-slate-100'
                              }
                            >
                              {run.summary.p95LatencyMs}ms
                            </span>
                          </td>
                          <td className="p-2.5 text-right tabular-nums">
                            <span
                              className={
                                run.summary.errorRatePercent > 2.0
                                  ? 'text-rose-600 dark:text-rose-400 font-bold'
                                  : 'text-emerald-600 dark:text-emerald-400'
                              }
                            >
                              {run.summary.errorRatePercent.toFixed(1)}%
                            </span>
                          </td>
                          <td className="p-2.5 pr-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => { onSelectRun(run); onNavigate('analysis'); }}
                                className="text-[11px] py-0.5 px-2 text-amber-600 dark:text-amber-400 font-mono"
                                title="Inspect Bottlenecks"
                              >
                                Findings
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => { onSelectRun(run); onNavigate('results'); }}
                                className="text-[11px] py-0.5 px-2 font-mono"
                              >
                                View
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Target Status Panel (1 col) */}
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Registered Targets"
              subtitle="Authorized servers and environments"
              action={
                <button
                  onClick={() => onNavigate('targets')}
                  className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-mono"
                >
                  Manage &rarr;
                </button>
              }
            />
            <CardContent className="p-3 space-y-2">
              {targets.map(target => (
                <div
                  key={target.id}
                  className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0E131D] hover:border-slate-300 dark:hover:border-slate-700 transition-colors font-mono"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate font-sans">
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
                      dot={false}
                    >
                      {target.environment}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-sky-600 dark:text-sky-400 truncate">
                    {target.baseUrl}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Ceiling: {target.limits.maxConcurrency} VUs</span>
                    <span>Cap: {target.limits.maxRps} RPS</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Comparison Card */}
          <Card className="p-4 bg-slate-100/70 dark:bg-[#0E131D] border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-1.5 text-slate-900 dark:text-slate-100 font-mono text-xs font-bold">
              <GitCompare className="w-4 h-4 text-sky-500" />
              <span>Regression Differential Tool</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Compare baseline vs. candidate runs to confirm whether database indexing or cache changes reduced p95 tail latencies.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate('comparisons')}
              className="w-full mt-3 text-xs font-mono"
            >
              Compare Runs &rarr;
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
