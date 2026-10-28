import React from 'react';
import {
  Github,
  GitPullRequest,
  CheckCircle2,
  Tag,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Users,
  Code2
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { NavigationRoute } from '../../types';

export const CommunityView: React.FC<{ onNavigate: (route: NavigationRoute) => void }> = ({ onNavigate }) => {
  const goodFirstIssues = [
    {
      id: '#14',
      title: 'feat(analyzer): Add memory leak slope detector for soak tests',
      labels: ['good first issue', 'enhancement', 'diagnostics'],
      description: 'Analyze telemetry over 60s+ to identify continuous non-recovering latency creep indicative of memory leaks.'
    },
    {
      id: '#19',
      title: 'feat(export): Add CSV and HAR export for raw percentile histograms',
      labels: ['good first issue', 'telemetry', 'export'],
      description: 'Allow engineers to export raw quantile samples for external analysis in Python/Pandas or R.'
    },
    {
      id: '#23',
      title: 'docs(guide): Add guide for benchmarking PostgreSQL connection pooling',
      labels: ['documentation', 'backend'],
      description: 'Document step-by-step how to reproduce the 10-connection pool cliff in project/src/config/db.js.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-100/70 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-mono font-medium mb-4">
          <Users className="w-3.5 h-3.5 text-sky-500" />
          <span>Open-Source Community & Contribution</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Built in the Open for Curious Engineers
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          DevFlow is developed collaboratively on GitHub under the <span className="font-mono text-sky-600 dark:text-sky-400 font-medium">adityasinghr651/Lab_Engineering</span> repository. We welcome student contributors, SREs, and backend developers.
        </p>
      </div>

      {/* GitHub Repository Spotlight */}
      <Card className="p-6 mb-12 border-slate-300 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-[#0F172A] dark:to-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Github className="w-6 h-6 text-slate-900 dark:text-slate-100" />
              <h2 className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
                adityasinghr651/Lab_Engineering
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
              Contains the core backend Express engine in <code className="font-mono">project/</code>, schema migrations, and performance testing testbeds.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/adityasinghr651/Lab_Engineering"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-mono font-semibold transition-colors"
            >
              <span>View Repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </Card>

      {/* Good First Issues */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-emerald-500" />
            <span>Good First Issues for Contributors</span>
          </h2>
          <a
            href="https://github.com/adityasinghr651/Lab_Engineering/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-mono"
          >
            <span>All issues on GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {goodFirstIssues.map(issue => (
            <Card key={issue.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">{issue.id}</span>
                  <Badge variant="success" size="sm">Help Wanted</Badge>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-2">
                  {issue.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {issue.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                {issue.labels.map(l => (
                  <span key={l} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {l}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Contribution Guidelines */}
      <Card className="p-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-sky-500" />
          <span>Local Development & Pull Request Workflow</span>
        </h2>
        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <p>
            1. Fork the <code className="font-mono text-sky-500">Lab_Engineering</code> repository to your GitHub profile.
          </p>
          <p>
            2. Clone your fork locally: <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">git clone https://github.com/&lt;your-username&gt;/Lab_Engineering.git</code>
          </p>
          <p>
            3. Run all tests before submitting: <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">npm test</code> inside <code className="font-mono">project/</code>.
          </p>
          <p>
            4. Submit a clear Pull Request referencing the issue number with reproducible benchmarking results.
          </p>
        </div>
      </Card>
    </div>
  );
};
