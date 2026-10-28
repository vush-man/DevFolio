import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  Cpu,
  Database,
  Layers,
  ArrowRight,
  Terminal,
  Activity,
  FileText
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TestRun, BottleneckFinding, NavigationRoute } from '../../types';

export interface AnalysisViewProps {
  runs: TestRun[];
  selectedRun: TestRun | null;
  onSelectRun: (run: TestRun) => void;
  onNavigate: (route: NavigationRoute) => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  runs,
  selectedRun,
  onSelectRun,
  onNavigate
}) => {
  const activeRun = selectedRun || runs[0];

  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  if (!activeRun) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        No test runs available for bottleneck analysis. Run a performance test first.
      </div>
    );
  }

  const findings = activeRun.findings || [];
  const filteredFindings = filterSeverity === 'all'
    ? findings
    : findings.filter(f => f.severity === filterSeverity);

  return (
    <div className="space-y-6">
      {/* Header & Run Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-mono">
              Bottleneck Diagnostics Workspace
            </h1>
            <Badge variant="warning" size="sm">
              {findings.length} Finding{findings.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Empirical evidence analysis, root-cause heuristics, and engineering investigation recommendations.
          </p>
        </div>

        {/* Run Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-mono">Run:</label>
          <select
            value={activeRun.id}
            onChange={e => {
              const run = runs.find(r => r.id === e.target.value);
              if (run) onSelectRun(run);
            }}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-sky-500 max-w-xs"
          >
            {runs.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.summary.avgRps} RPS - p95: {r.summary.p95LatencyMs}ms)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex items-center gap-2 pb-2">
        <span className="text-xs text-slate-400 font-mono uppercase mr-2">Severity:</span>
        {['all', 'critical', 'high', 'medium', 'low'].map(sev => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-2.5 py-1 text-xs rounded-md font-mono capitalize transition-colors ${
              filterSeverity === sev
                ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-bold border border-sky-300 dark:border-sky-800'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Findings List */}
      {filteredFindings.length === 0 ? (
        <Card className="p-8 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            No Bottlenecks Detected in this Severity Class
          </h3>
          <p className="text-xs text-slate-500">
            Workload execution showed stable throughput, no critical queueing, and within-tolerance tail latencies.
          </p>
        </Card>
      ) : (
        <div className="space-y-5">
          {filteredFindings.map((finding, idx) => {
            const severityTheme = {
              critical: 'border-l-4 border-l-rose-500 bg-rose-50/20 dark:bg-rose-950/10',
              high: 'border-l-4 border-l-amber-500 bg-amber-50/20 dark:bg-amber-950/10',
              medium: 'border-l-4 border-l-sky-500 bg-sky-50/20 dark:bg-sky-950/10',
              low: 'border-l-4 border-l-slate-400 bg-slate-50/30 dark:bg-slate-900/20'
            }[finding.severity];

            return (
              <Card key={finding.id || idx} className={`p-6 transition-all ${severityTheme}`}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className={`w-5 h-5 shrink-0 ${
                      finding.severity === 'critical' ? 'text-rose-500' : finding.severity === 'high' ? 'text-amber-500' : 'text-sky-500'
                    }`} />
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                      {finding.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      Confidence: <strong className="text-slate-700 dark:text-slate-200">{finding.confidence}%</strong>
                    </span>
                    <Badge
                      variant={finding.severity === 'critical' ? 'danger' : finding.severity === 'high' ? 'warning' : 'neutral'}
                      size="sm"
                    >
                      {finding.severity.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Empirical Evidence & Metric Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 mb-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Observed Metric</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{finding.metric}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Time Range</span>
                    <span className="text-slate-700 dark:text-slate-300">{finding.timeRange}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Category</span>
                    <span className="text-sky-600 dark:text-sky-400 uppercase font-semibold">{finding.category}</span>
                  </div>
                </div>

                {/* Evidence statement */}
                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-1">
                      Observed Evidence:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 font-mono bg-slate-100/70 dark:bg-slate-900/50 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                      {finding.evidence}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-1">
                      Potential Architectural Explanation:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300">
                      {finding.explanation}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300 block mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Recommended Engineering Investigation:</span>
                    </span>
                    <p className="text-slate-700 dark:text-slate-300">
                      {finding.recommendation}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Footer link to generate report */}
      <div className="pt-4 flex items-center justify-between text-xs border-t border-slate-200 dark:border-slate-800">
        <span className="text-slate-500">
          Want to share these findings with your infrastructure team?
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onNavigate('reports')}
          leftIcon={<FileText className="w-3.5 h-3.5" />}
        >
          Generate Shareable Report &rarr;
        </Button>
      </div>
    </div>
  );
};
