import React, { useState } from 'react';
import {
  GitCompare,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  Sliders
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TestRun, NavigationRoute } from '../../types';

export interface ComparisonsViewProps {
  runs: TestRun[];
  baselineRunId?: string;
  onNavigate: (route: NavigationRoute) => void;
}

export const ComparisonsView: React.FC<ComparisonsViewProps> = ({
  runs,
  baselineRunId,
  onNavigate
}) => {
  const [runAId, setRunAId] = useState<string>(baselineRunId || runs[0]?.id || '');
  const [runBId, setRunBId] = useState<string>(runs[1]?.id || runs[0]?.id || '');

  if (runs.length < 2) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <GitCompare className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
          Need at Least Two Test Runs to Compare
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Comparisons require a baseline test run and a candidate test run to compute regression deltas across latency, throughput, and error rates.
        </p>
        <Button
          size="md"
          variant="primary"
          onClick={() => onNavigate('create-test')}
          className="font-mono text-xs"
        >
          Launch Another Test &rarr;
        </Button>
      </div>
    );
  }

  const runA = runs.find(r => r.id === runAId) || runs[0];
  const runB = runs.find(r => r.id === runBId) || runs[1];

  // Deltas: B minus A
  const deltaRps = runB.summary.avgRps - runA.summary.avgRps;
  const deltaRpsPercent = runA.summary.avgRps > 0
    ? ((deltaRps / runA.summary.avgRps) * 100).toFixed(1)
    : '0';

  const deltaP95 = runB.summary.p95LatencyMs - runA.summary.p95LatencyMs;
  const deltaP95Percent = runA.summary.p95LatencyMs > 0
    ? ((deltaP95 / runA.summary.p95LatencyMs) * 100).toFixed(1)
    : '0';

  const deltaP50 = runB.summary.p50LatencyMs - runA.summary.p50LatencyMs;
  const deltaError = runB.summary.errorRatePercent - runA.summary.errorRatePercent;

  // Check config equality
  const configsMatch =
    runA.profile.concurrency === runB.profile.concurrency &&
    runA.profile.testType === runB.profile.testType &&
    runA.profile.endpointPath === runB.profile.endpointPath;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-mono">
            Workload Regression Comparison
          </h1>
          <Badge variant="info" size="sm">Diff Engine</Badge>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Evaluate performance regressions or improvements between baseline and candidate test runs.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
        {/* Run A (Baseline) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-sky-600 dark:text-sky-400 uppercase">Run A (Baseline)</span>
            <Badge variant="neutral" size="sm">Baseline</Badge>
          </div>
          <select
            value={runAId}
            onChange={e => setRunAId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            {runs.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.profile.concurrency} VUs - {r.summary.avgRps} RPS)
              </option>
            ))}
          </select>
        </div>

        {/* Run B (Candidate) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">Run B (Candidate)</span>
            <Badge variant="info" size="sm">Candidate</Badge>
          </div>
          <select
            value={runBId}
            onChange={e => setRunBId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            {runs.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.profile.concurrency} VUs - {r.summary.avgRps} RPS)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Configuration Differences Warning if parameters differ */}
      {!configsMatch && (
        <div className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <strong>Configuration Variance Notice:</strong> The selected runs were executed with different workload parameters:
            <div className="font-mono text-[11px] text-amber-700 dark:text-amber-400">
              Run A: {runA.profile.concurrency} VUs ({runA.profile.testType}) &bull; Run B: {runB.profile.concurrency} VUs ({runB.profile.testType})
            </div>
            <span>Take workload differences into account when interpreting throughput and latency deltas.</span>
          </div>
        </div>
      )}

      {/* Delta KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Throughput Delta */}
        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono mb-2">
            <span>Throughput Delta</span>
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className={`text-2xl font-bold tabular-nums ${deltaRps >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {deltaRps > 0 ? `+${deltaRps.toFixed(1)}` : deltaRps.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500">RPS ({deltaRpsPercent}%)</span>
          </div>
          <div className="mt-2 text-xs font-mono text-slate-500 flex justify-between">
            <span>A: {runA.summary.avgRps} RPS</span>
            <span>B: {runB.summary.avgRps} RPS</span>
          </div>
        </Card>

        {/* p95 Latency Delta */}
        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono mb-2">
            <span>p95 Latency Delta</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            {/* Note: Lower latency is better (negative delta is positive improvement) */}
            <span className={`text-2xl font-bold tabular-nums ${deltaP95 <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {deltaP95 > 0 ? `+${deltaP95.toFixed(1)}` : deltaP95.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500">ms ({deltaP95Percent}%)</span>
          </div>
          <div className="mt-2 text-xs font-mono text-slate-500 flex justify-between">
            <span>A: {runA.summary.p95LatencyMs}ms</span>
            <span>B: {runB.summary.p95LatencyMs}ms</span>
          </div>
        </Card>

        {/* Error Rate Delta */}
        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-mono mb-2">
            <span>Error Rate Delta</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className={`text-2xl font-bold tabular-nums ${deltaError <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {deltaError > 0 ? `+${deltaError.toFixed(2)}` : deltaError.toFixed(2)}%
            </span>
            <span className="text-xs text-slate-500">points</span>
          </div>
          <div className="mt-2 text-xs font-mono text-slate-500 flex justify-between">
            <span>A: {runA.summary.errorRatePercent.toFixed(1)}%</span>
            <span>B: {runB.summary.errorRatePercent.toFixed(1)}%</span>
          </div>
        </Card>
      </div>

      {/* Side-by-Side Detailed Breakdown Table */}
      <Card>
        <CardHeader
          title="Direct Side-by-Side Metric Comparison"
          subtitle="Comprehensive quantile and throughput comparison"
        />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase text-[11px]">
                  <th className="p-3 pl-4">Metric / Parameter</th>
                  <th className="p-3 text-right">Run A (Baseline)</th>
                  <th className="p-3 text-right">Run B (Candidate)</th>
                  <th className="p-3 pr-4 text-right">Difference (Δ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                <tr>
                  <td className="p-3 pl-4 text-slate-600 dark:text-slate-400 font-sans">Concurrency (VUs)</td>
                  <td className="p-3 text-right">{runA.profile.concurrency}</td>
                  <td className="p-3 text-right">{runB.profile.concurrency}</td>
                  <td className="p-3 pr-4 text-right text-slate-500">
                    {runB.profile.concurrency - runA.profile.concurrency}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 pl-4 text-slate-600 dark:text-slate-400 font-sans">Total Requests</td>
                  <td className="p-3 text-right">{runA.summary.totalRequests.toLocaleString()}</td>
                  <td className="p-3 text-right">{runB.summary.totalRequests.toLocaleString()}</td>
                  <td className="p-3 pr-4 text-right text-slate-500">
                    {runB.summary.totalRequests - runA.summary.totalRequests}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 pl-4 text-slate-600 dark:text-slate-400 font-sans">Throughput (Avg RPS)</td>
                  <td className="p-3 text-right">{runA.summary.avgRps}</td>
                  <td className="p-3 text-right">{runB.summary.avgRps}</td>
                  <td className={`p-3 pr-4 text-right font-bold ${deltaRps >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {deltaRps > 0 ? `+${deltaRps.toFixed(1)}` : deltaRps.toFixed(1)} ({deltaRpsPercent}%)
                  </td>
                </tr>
                <tr>
                  <td className="p-3 pl-4 text-slate-600 dark:text-slate-400 font-sans">p50 Latency (Median)</td>
                  <td className="p-3 text-right">{runA.summary.p50LatencyMs}ms</td>
                  <td className="p-3 text-right">{runB.summary.p50LatencyMs}ms</td>
                  <td className={`p-3 pr-4 text-right font-bold ${deltaP50 <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {deltaP50 > 0 ? `+${deltaP50.toFixed(1)}` : deltaP50.toFixed(1)}ms
                  </td>
                </tr>
                <tr>
                  <td className="p-3 pl-4 text-slate-600 dark:text-slate-400 font-sans">p95 Latency</td>
                  <td className="p-3 text-right">{runA.summary.p95LatencyMs}ms</td>
                  <td className="p-3 text-right">{runB.summary.p95LatencyMs}ms</td>
                  <td className={`p-3 pr-4 text-right font-bold ${deltaP95 <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {deltaP95 > 0 ? `+${deltaP95.toFixed(1)}` : deltaP95.toFixed(1)}ms ({deltaP95Percent}%)
                  </td>
                </tr>
                <tr>
                  <td className="p-3 pl-4 text-slate-600 dark:text-slate-400 font-sans">p99 Latency (Tail)</td>
                  <td className="p-3 text-right">{runA.summary.p99LatencyMs}ms</td>
                  <td className="p-3 text-right">{runB.summary.p99LatencyMs}ms</td>
                  <td className={`p-3 pr-4 text-right font-bold ${runB.summary.p99LatencyMs - runA.summary.p99LatencyMs <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {(runB.summary.p99LatencyMs - runA.summary.p99LatencyMs).toFixed(1)}ms
                  </td>
                </tr>
                <tr>
                  <td className="p-3 pl-4 text-slate-600 dark:text-slate-400 font-sans">Error Rate</td>
                  <td className="p-3 text-right">{runA.summary.errorRatePercent.toFixed(2)}%</td>
                  <td className="p-3 text-right">{runB.summary.errorRatePercent.toFixed(2)}%</td>
                  <td className={`p-3 pr-4 text-right font-bold ${deltaError <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {deltaError > 0 ? `+${deltaError.toFixed(2)}` : deltaError.toFixed(2)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
