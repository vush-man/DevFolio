import React from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  BarChart3,
  FileText,
  GitCompare,
  ArrowRight,
  Repeat,
  Download,
  ShieldCheck,
  XCircle
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MetricCard } from '../../components/ui/MetricCard';
import { TelemetryChart } from '../../components/charts/TelemetryChart';
import { TestRun, NavigationRoute } from '../../types';

export interface TestResultsViewProps {
  run: TestRun | null;
  onNavigate: (route: NavigationRoute) => void;
  onSelectRunForComparison: (run: TestRun) => void;
  onRetest: (run: TestRun) => void;
}

export const TestResultsView: React.FC<TestResultsViewProps> = ({
  run,
  onNavigate,
  onSelectRunForComparison,
  onRetest
}) => {
  if (!run) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        No completed test selected. Select a run from the history or launch a new test.
      </div>
    );
  }

  const { summary, profile } = run;

  return (
    <div className="space-y-6">
      {/* Run Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-mono">
              {run.name}
            </h1>
            <Badge
              variant={run.status === 'completed' ? 'success' : run.status === 'failed' ? 'danger' : 'warning'}
              size="sm"
            >
              {run.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
            Target: <span className="text-sky-600 dark:text-sky-400">{run.targetUrl}{profile.endpointPath}</span> &bull; {run.elapsedSeconds}s duration &bull; Finished at {new Date(run.finishedAt || run.startedAt).toLocaleTimeString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRetest(run)}
            leftIcon={<Repeat className="w-3.5 h-3.5" />}
          >
            Retest
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => { onSelectRunForComparison(run); onNavigate('comparisons'); }}
            leftIcon={<GitCompare className="w-3.5 h-3.5" />}
          >
            Compare Run
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onNavigate('reports')}
            leftIcon={<FileText className="w-3.5 h-3.5" />}
          >
            Report View
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onNavigate('analysis')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Bottlenecks ({run.findings.length})
          </Button>
        </div>
      </div>

      {/* Threshold / SLO Results Card */}
      <Card className="p-4 bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-slate-100 font-mono">
            <ShieldCheck className="w-4 h-4 text-sky-500" />
            <span>Service Level Objective (SLO) Verdict:</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              {summary.thresholdResults.p95Passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500" />
              )}
              <span className="text-slate-600 dark:text-slate-300">
                p95 Latency (&lt;{profile.thresholds.p95LatencyMs || 200}ms):
              </span>
              <span className={summary.thresholdResults.p95Passed ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                {summary.p95LatencyMs}ms {summary.thresholdResults.p95Passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {summary.thresholdResults.errorRatePassed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500" />
              )}
              <span className="text-slate-600 dark:text-slate-300">
                Error Rate (&lt;{profile.thresholds.maxErrorRatePercent || 1}%):
              </span>
              <span className={summary.thresholdResults.errorRatePassed ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                {summary.errorRatePercent.toFixed(1)}% {summary.thresholdResults.errorRatePassed ? 'PASSED' : 'FAILED'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          label="Total Requests"
          value={summary.totalRequests.toLocaleString()}
          subtext={`${summary.successfulRequests.toLocaleString()} succeeded`}
          icon={<Activity className="w-4 h-4" />}
          status="nominal"
        />

        <MetricCard
          label="Average Throughput"
          value={summary.avgRps}
          unit="RPS"
          subtext={`Peak: ${summary.peakRps} req/s`}
          icon={<Zap className="w-4 h-4" />}
          status="nominal"
        />

        <MetricCard
          label="p95 Latency"
          value={summary.p95LatencyMs}
          unit="ms"
          subtext={`p50: ${summary.p50LatencyMs}ms`}
          icon={<Clock className="w-4 h-4" />}
          status={summary.p95LatencyMs > 250 ? 'warning' : 'nominal'}
        />

        <MetricCard
          label="Error Rate"
          value={summary.errorRatePercent}
          unit="%"
          subtext={`${summary.failedRequests} errors recorded`}
          icon={<AlertTriangle className="w-4 h-4" />}
          status={summary.errorRatePercent > 2.0 ? 'critical' : 'nominal'}
        />
      </div>

      {/* Latency Percentile Histogram Table */}
      <Card>
        <CardHeader
          title="Latency Percentiles Distribution"
          subtitle="Empirical response time spectrum across entire test duration"
        />
        <CardContent className="p-0">
          <div className="grid grid-cols-2 sm:grid-cols-6 divide-x divide-slate-100 dark:divide-slate-800 text-center font-mono">
            <div className="p-4">
              <span className="text-[10px] uppercase text-slate-400 block mb-1">Min Latency</span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {summary.minLatencyMs}ms
              </span>
            </div>
            <div className="p-4">
              <span className="text-[10px] uppercase text-sky-500 font-semibold block mb-1">p50 (Median)</span>
              <span className="text-lg font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                {summary.p50LatencyMs}ms
              </span>
            </div>
            <div className="p-4">
              <span className="text-[10px] uppercase text-slate-400 block mb-1">p90 Latency</span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {summary.p90LatencyMs}ms
              </span>
            </div>
            <div className="p-4">
              <span className="text-[10px] uppercase text-amber-500 font-semibold block mb-1">p95 Latency</span>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                {summary.p95LatencyMs}ms
              </span>
            </div>
            <div className="p-4">
              <span className="text-[10px] uppercase text-rose-500 font-semibold block mb-1">p99 (Tail)</span>
              <span className="text-lg font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                {summary.p99LatencyMs}ms
              </span>
            </div>
            <div className="p-4">
              <span className="text-[10px] uppercase text-slate-400 block mb-1">Max Latency</span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {summary.maxLatencyMs}ms
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Latency Telemetry Chart */}
      <Card>
        <CardHeader
          title="Telemetry Curve: Latency Percentiles Over Time"
          subtitle="Second-by-second response time profile throughout the execution run"
        />
        <CardContent>
          <TelemetryChart
            data={run.telemetry}
            type="latency"
            height={240}
          />
        </CardContent>
      </Card>

      {/* Status Codes & Findings Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Codes */}
        <Card>
          <CardHeader
            title="HTTP Status Distribution"
            subtitle="Response codes emitted by target server"
          />
          <CardContent className="space-y-3 font-mono text-xs">
            {Object.entries(summary.statusCodes).map(([code, count]) => {
              const percent = ((count / Math.max(1, summary.totalRequests)) * 100).toFixed(1);
              return (
                <div key={code} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold">HTTP {code}</span>
                  </div>
                  <div className="text-slate-500">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{count.toLocaleString()}</span> ({percent}%)
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Bottleneck Highlights */}
        <Card>
          <CardHeader
            title={`Identified Bottlenecks (${run.findings.length})`}
            subtitle="Automated performance diagnostic findings"
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => onNavigate('analysis')}
                className="text-xs font-mono"
              >
                Full Analysis
              </Button>
            }
          />
          <CardContent className="space-y-3">
            {run.findings.length === 0 ? (
              <div className="text-xs text-slate-500 py-4 text-center">
                No critical performance bottlenecks identified. Nominal operation.
              </div>
            ) : (
              run.findings.map(finding => (
                <div
                  key={finding.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      {finding.title}
                    </span>
                    <Badge
                      variant={finding.severity === 'critical' ? 'danger' : finding.severity === 'high' ? 'warning' : 'neutral'}
                      size="sm"
                    >
                      {finding.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {finding.evidence}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
