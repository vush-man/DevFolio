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
  FileText
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
  // Aggregate stats across runs
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
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-mono">
              Engineering Overview
            </h1>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
              Live Lab
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time telemetry, target health status, and recent workload execution summaries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate('targets')}
            leftIcon={<Server className="w-3.5 h-3.5" />}
          >
            Manage Targets ({targets.length})
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onNavigate('create-test')}
            leftIcon={<PlayCircle className="w-3.5 h-3.5" />}
          >
            Launch Test
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Test Runs"
          value={totalRuns}
          subtext={`${completedRuns.length} completed successfully`}
          icon={<Activity className="w-4 h-4" />}
          status="nominal"
        />

        <MetricCard
          label="Avg Throughput"
          value={avgThroughput}
          unit="RPS"
          subtext="Across all workloads"
          trend={{ value: "+18% vs baseline", isPositive: true }}
          icon={<Zap className="w-4 h-4" />}
          status="default"
        />

        <MetricCard
          label="Mean p95 Latency"
          value={avgP95}
          unit="ms"
          subtext="Critical SLO indicator"
          trend={{ value: avgP95 > 200 ? "Degraded" : "Nominal", isPositive: avgP95 <= 200 }}
          icon={<Clock className="w-4 h-4" />}
          status={avgP95 > 200 ? "warning" : "nominal"}
        />

        <MetricCard
          label="Global Error Rate"
          value={globalErrorRate}
          unit="%"
          subtext={`${totalErrors.toLocaleString()} failed requests`}
          icon={<AlertTriangle className="w-4 h-4" />}
          status={globalErrorRate > 3.0 ? "critical" : "nominal"}
        />
      </div>

      {/* Getting Started Checklist for Engineers */}
      <Card className="border-sky-200 dark:border-sky-900/50 bg-sky-50/30 dark:bg-sky-950/20 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Performance Testing Checklist</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Verify your API target before running high-concurrency stress tests.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Target Verified (DevFlow Local)</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              onClick={() => onNavigate('create-test')}
              className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Run Load Test Wizard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Main Two-Column Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Runs Table (2 cols) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Recent Workload Executions"
              subtitle="Latest performance benchmark sessions and diagnostic verdicts"
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
                <div className="p-8 text-center text-xs text-slate-400">
                  No test runs recorded yet. Launch your first test.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-[11px] font-mono text-slate-500 uppercase">
                        <th className="p-3 pl-4">Run Name & Target</th>
                        <th className="p-3">Type</th>
                        <th className="p-3 font-mono text-right">Throughput</th>
                        <th className="p-3 font-mono text-right">p95 Latency</th>
                        <th className="p-3 font-mono text-right">Error Rate</th>
                        <th className="p-3 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {runs.slice(0, 5).map(run => {
                        const statusBadge = {
                          completed: 'success',
                          running: 'info',
                          cancelled: 'warning',
                          failed: 'danger',
                          pending: 'neutral',
                          paused: 'warning'
                        }[run.status] as any;

                        return (
                          <tr
                            key={run.id}
                            className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            <td className="p-3 pl-4">
                              <button
                                onClick={() => { onSelectRun(run); onNavigate('results'); }}
                                className="font-semibold text-slate-900 dark:text-slate-100 hover:text-sky-500 text-left block truncate max-w-xs"
                              >
                                {run.name}
                              </button>
                              <span className="text-[11px] font-mono text-slate-500 block truncate">
                                {run.targetName} &bull; {run.profile.endpointPath}
                              </span>
                            </td>
                            <td className="p-3">
                              <Badge variant="neutral" size="sm" dot={false}>
                                {run.profile.testType.toUpperCase()}
                              </Badge>
                            </td>
                            <td className="p-3 font-mono text-right tabular-nums font-medium text-slate-900 dark:text-slate-100">
                              {run.summary.avgRps} <span className="text-[10px] text-slate-400">RPS</span>
                            </td>
                            <td className="p-3 font-mono text-right tabular-nums font-medium">
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
                            <td className="p-3 font-mono text-right tabular-nums">
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
                            <td className="p-3 pr-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => { onSelectRun(run); onNavigate('analysis'); }}
                                  className="text-[11px] py-1 px-2 text-amber-600 dark:text-amber-400"
                                  title="Inspect Bottlenecks"
                                >
                                  Analysis
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => { onSelectRun(run); onNavigate('results'); }}
                                  className="text-[11px] py-1 px-2"
                                >
                                  Details
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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
              title="Testing Targets"
              subtitle="Authorized servers and environments"
              action={
                <button
                  onClick={() => onNavigate('targets')}
                  className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-mono"
                >
                  Add Target
                </button>
              }
            />
            <CardContent className="p-3 space-y-2">
              {targets.map(target => (
                <div
                  key={target.id}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                      {target.name}
                    </span>
                    <Badge variant={target.isVerified ? 'success' : 'warning'} size="sm">
                      {target.environment}
                    </Badge>
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 truncate">
                    {target.baseUrl}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Max {target.limits.maxConcurrency} VUs</span>
                    <span>Cap: {target.limits.maxRps} RPS</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Comparison Card */}
          <Card className="p-4 bg-slate-900 text-slate-100 dark:bg-slate-950 border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-sky-400 font-semibold text-xs">
              <GitCompare className="w-4 h-4" />
              <span>Regression Analysis</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Compare your latest test run against a stable baseline to confirm that optimizations actually lowered p95 latency.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate('comparisons')}
              className="w-full mt-3 text-xs border-slate-700 text-slate-200 hover:bg-slate-800"
            >
              Compare Runs &rarr;
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
