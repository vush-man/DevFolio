import React from 'react';
import {
  Activity,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  GitBranch,
  Terminal,
  Zap
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { NavigationRoute } from '../../types';

export const ProductView: React.FC<{ onNavigate: (route: NavigationRoute) => void }> = ({ onNavigate }) => {
  const capabilities = [
    {
      feature: 'In-App Concurrent Workload Engine',
      description: 'Real asynchronous fetch execution with configurable VUs, custom headers, and pacing.',
      status: 'implemented',
      tier: 'v1.0.4'
    },
    {
      feature: 'Sliding-Window Latency Percentiles',
      description: 'Accurate sub-millisecond p50, p90, p95, and p99 percentile calculation via reservoir sampling.',
      status: 'implemented',
      tier: 'v1.0.4'
    },
    {
      feature: 'Automated Bottleneck Diagnosis',
      description: 'Deterministic heuristic rules identifying pool exhaustion, 5xx cascades, and tail divergence.',
      status: 'implemented',
      tier: 'v1.0.4'
    },
    {
      feature: 'Regression Run Comparisons',
      description: 'Side-by-side test run comparison with calculated absolute and percentage deltas.',
      status: 'implemented',
      tier: 'v1.0.4'
    },
    {
      feature: 'Audit-Ready Printable & JSON Reports',
      description: 'Executive performance summaries with threshold verdicts and complete workload telemetry.',
      status: 'implemented',
      tier: 'v1.0.4'
    },
    {
      feature: 'DevFlow Local Core API Target Adapter',
      description: 'Pre-configured endpoints connecting to the audited project/ backend (/api/devflow/*).',
      status: 'implemented',
      tier: 'v1.0.4'
    },
    {
      feature: 'Distributed Load Generation Across Nodes',
      description: 'Multi-node cluster coordination for generating 50,000+ RPS across distributed regions.',
      status: 'planned',
      tier: 'v1.2 (Planned)'
    },
    {
      feature: 'CI/CD GitHub Actions & GitLab Runners',
      description: 'Automated performance regression gates failing pull requests if p95 latency degrades >15%.',
      status: 'planned',
      tier: 'v1.1 (Planned)'
    },
    {
      feature: 'eBPF Kernel-Level Socket & CPU Profiling',
      description: 'Deep kernel observability correlating packet drops and TCP retransmits with latency spikes.',
      status: 'planned',
      tier: 'v2.0 (Planned)'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-100/70 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-mono font-medium mb-4">
          <Layers className="w-3.5 h-3.5 text-sky-500" />
          <span>System Architecture & Capabilities</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Designed for Clarity. Powered by Empirical Telemetry.
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          DevFlow is an open-source performance engineering platform designed to eliminate the friction of benchmarking backend services. Understand what is currently available and what is planned for our roadmap.
        </p>
      </div>

      {/* Architecture Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card className="p-5">
          <div className="flex items-center gap-2.5 mb-3 text-sky-600 dark:text-sky-400 font-semibold text-sm">
            <Cpu className="w-5 h-5" />
            <span>Telemetry & Quantile Engine</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Measures response time per request using the browser <code className="font-mono text-sky-600 dark:text-sky-400">performance.now()</code> API. Aggregates data into 1-second histogram buckets to yield true p50, p90, p95, and p99 curves without memory degradation.
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2.5 mb-3 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Safety & Rate Governance</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Enforces strict pre-launch verification, duration timeouts, concurrency bounds, and instant abort signals. Designed so developers can safely test without causing accidental denial-of-service.
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2.5 mb-3 text-amber-600 dark:text-amber-400 font-semibold text-sm">
            <GitBranch className="w-5 h-5" />
            <span>Deterministic Heuristics</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Evaluates test metrics against 6 performance heuristics to generate actionable diagnostic recommendations (e.g. database connection pool saturation, cold start penalties, and queue backlog spikes).
          </p>
        </Card>
      </div>

      {/* Implemented vs Planned Capabilities Matrix */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Platform Capabilities & Delivery Status
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Transparent breakdown of fully functional features versus roadmap capabilities in development.
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onNavigate('create-test')}
          >
            Launch Test Console
          </Button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-mono text-[11px] text-slate-500 dark:text-slate-400 uppercase">
                <th className="p-4">Capability & Module</th>
                <th className="p-4">Description</th>
                <th className="p-4 w-32">Status</th>
                <th className="p-4 w-28">Milestone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {capabilities.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                    {c.feature}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    {c.description}
                  </td>
                  <td className="p-4">
                    {c.status === 'implemented' ? (
                      <Badge variant="success" size="sm">Available Now</Badge>
                    ) : (
                      <Badge variant="warning" size="sm" dot={false}>Planned</Badge>
                    )}
                  </td>
                  <td className="p-4 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                    {c.tier}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="p-8 rounded-2xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/50 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
            Ready to profile your first endpoint?
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Test the pre-configured DevFlow Local Core API target or connect your own service in under 60 seconds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="md"
            variant="primary"
            onClick={() => onNavigate('create-test')}
          >
            Create Load Test
          </Button>
          <Button
            size="md"
            variant="outline"
            onClick={() => onNavigate('docs')}
          >
            Read Documentation
          </Button>
        </div>
      </div>
    </div>
  );
};
