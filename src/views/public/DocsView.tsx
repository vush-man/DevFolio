import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Terminal,
  Code2,
  Server,
  Zap,
  Activity,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { NavigationRoute } from '../../types';

interface DocChapter {
  id: string;
  title: string;
  section: string;
  content: React.ReactNode;
}

export const DocsView: React.FC<{ onNavigate: (route: NavigationRoute) => void }> = ({ onNavigate }) => {
  const [activeChapterId, setActiveChapterId] = useState<string>('intro');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const chapters: DocChapter[] = [
    {
      id: 'intro',
      section: 'Getting Started',
      title: 'Introduction & Overview',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <strong>DevFlow</strong> is an open-source server performance engineering and load testing platform created to help developers, students, and infrastructure teams measure, analyze, and optimize backend server capacity under controlled stress.
          </p>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            Unlike traditional monolithic load testing clusters that require complicated configuration files, separate cloud infrastructure, and proprietary agents, DevFlow provides an intuitive, web-native workflow to run real HTTP traffic workloads directly against authorized endpoints.
          </p>
          <div className="p-4 rounded-lg bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50 text-xs text-sky-800 dark:text-sky-300">
            <strong>Core Philosophy:</strong> Make complex performance metrics—such as 95th/99th percentile latencies and connection pool saturation—observable and actionable without obscuring the underlying engineering reality.
          </div>
        </div>
      )
    },
    {
      id: 'quickstart',
      section: 'Getting Started',
      title: 'Quickstart Guide',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            Follow this 2-minute guide to run your first benchmark against the local DevFlow core API.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li>Navigate to the <strong>Servers & Targets</strong> tab to verify the pre-configured target.</li>
            <li>Click <strong>Create Test</strong> in the top navigation or sidebar.</li>
            <li>Select <strong>DevFlow Local Core API</strong> as your target.</li>
            <li>Choose the <strong>Load Test</strong> profile (15 VUs, 30s duration, 5s ramp-up).</li>
            <li>Complete the <strong>Safety Review</strong> and click <strong>Launch Test</strong>.</li>
            <li>Watch real-time p50/p95 latency curves in the <strong>Live Monitoring</strong> cockpit!</li>
          </ol>
        </div>
      )
    },
    {
      id: 'backend',
      section: 'Integration',
      title: 'DevFlow Backend Integration (project/)',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            DevFlow directly integrates with the Express backend located in the audited <code className="font-mono text-sky-500">project/</code> directory of our GitHub repository.
          </p>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto relative">
            <button
              onClick={() => copyToClipboard('cd project\nnpm install\nnpm run dev', 'code-backend')}
              className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Copy code"
            >
              {copiedCodeId === 'code-backend' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <pre className="text-sky-300"># Start local backend service</pre>
            <pre className="mt-1">cd project</pre>
            <pre>npm install</pre>
            <pre>npm run dev</pre>
            <pre className="mt-2 text-slate-400"># Service starts on http://localhost:3000</pre>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Key endpoints tested: <code className="font-mono text-xs">/api/devflow/health</code>, <code className="font-mono text-xs">/api/devflow/echo</code>, <code className="font-mono text-xs">/api/devflow/users/:id</code>, and <code className="font-mono text-xs">/api/devflow/search</code>.
          </p>
        </div>
      )
    },
    {
      id: 'metrics',
      section: 'Performance Concepts',
      title: 'Understanding Metrics & Percentiles',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            Average response time is misleading. A service with an average latency of 25ms can easily have 5% of its requests stalling for 2,000ms.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <span className="font-mono font-bold text-sky-500">p50 (Median)</span>
              <p className="mt-1 text-slate-600 dark:text-slate-400">Response time experienced by exactly 50% of requests. Represents the typical user experience.</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <span className="font-mono font-bold text-amber-500">p95 Percentile</span>
              <p className="mt-1 text-slate-600 dark:text-slate-400">95% of requests completed faster than this threshold. Standard SLA / SLO benchmark.</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <span className="font-mono font-bold text-rose-500">p99 (Tail Latency)</span>
              <p className="mt-1 text-slate-600 dark:text-slate-400">Captures the slowest 1% of transactions. Exposes GC pauses, thread queueing, and lock stalls.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'profiles',
      section: 'Workload Configuration',
      title: 'Test Profiles: Load, Stress, Spike & Soak',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            DevFlow provides four standardized workload models:
          </p>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <li><strong>Load Test:</strong> Ramps up smoothly to target concurrency and maintains steady traffic to verify nominal operating conditions.</li>
            <li><strong>Stress Test:</strong> Continually increases concurrency beyond expected limits to locate the breaking point or capacity cliff.</li>
            <li><strong>Spike Test:</strong> Injects sudden instantaneous surges of virtual users to test auto-scaling, thread pools, and queue buffers.</li>
            <li><strong>Soak Test:</strong> Sustains moderate traffic over extended durations to uncover slow memory leaks and resource degradation.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'safety',
      section: 'Security & Safety',
      title: 'Responsible Testing & Safety Safeguards',
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            High-volume traffic generation without safeguards risks taking down services or violating provider terms. DevFlow enforces strict safeguards:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <li>Explicit confirmation checkbox in Step 4 Safety Review.</li>
            <li>Hard upper bounds on browser concurrency (max 50 VUs).</li>
            <li>Configurable per-target duration timeouts (default 120s max).</li>
            <li>Instant abort signal that immediately cancels active HTTP fetches.</li>
          </ul>
        </div>
      )
    }
  ];

  const filteredChapters = chapters.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeChapter = chapters.find(c => c.id === activeChapterId) || chapters[0];
  const currentIndex = chapters.findIndex(c => c.id === activeChapter.id);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <button onClick={() => onNavigate('landing')} className="hover:text-sky-500">DevFlow</button>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-200 font-medium">Documentation</span>
          <span>/</span>
          <span className="text-sky-600 dark:text-sky-400">{activeChapter.title}</span>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Docs Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5">
              Documentation Chapters
            </span>
            {filteredChapters.map(ch => {
              const isActive = ch.id === activeChapter.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapterId(ch.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <span className="truncate">{ch.title}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-sky-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          <Card className="p-4 bg-slate-50 dark:bg-slate-900/50">
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-sky-500" />
              <span>Need help?</span>
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Have an issue or question about DevFlow? Visit the community hub.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate('community')}
              className="w-full mt-3 text-xs"
            >
              Community & Issues
            </Button>
          </Card>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 max-w-3xl">
          <div className="mb-2 text-xs font-mono text-sky-600 dark:text-sky-400 uppercase tracking-wider font-semibold">
            {activeChapter.section}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight mb-6">
            {activeChapter.title}
          </h1>

          <div className="prose dark:prose-invert max-w-none">
            {activeChapter.content}
          </div>

          {/* Chapter Pagination */}
          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            {prevChapter ? (
              <button
                onClick={() => setActiveChapterId(prevChapter.id)}
                className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-sky-500 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <div className="text-left">
                  <span className="block text-[10px] text-slate-400 uppercase">Previous</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{prevChapter.title}</span>
                </div>
              </button>
            ) : <div />}

            {nextChapter ? (
              <button
                onClick={() => setActiveChapterId(nextChapter.id)}
                className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-sky-500 transition-colors text-right"
              >
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">Next</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{nextChapter.title}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : <div />}
          </div>
        </main>
      </div>
    </div>
  );
};
