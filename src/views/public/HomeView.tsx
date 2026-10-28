import React, { useState } from 'react';
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
  Users
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { NavigationRoute } from '../../types';

export const HomeView: React.FC<{ onNavigate: (route: NavigationRoute) => void }> = ({ onNavigate }) => {
  const [demoVUs, setDemoVUs] = useState(25);
  const [demoRps, setDemoRps] = useState(185);
  const [demoLatency, setDemoLatency] = useState(38);
  const [isDemoSpiking, setIsDemoSpiking] = useState(false);

  const triggerDemoSpike = () => {
    setIsDemoSpiking(true);
    setDemoVUs(60);
    setDemoRps(340);
    setDemoLatency(185);

    setTimeout(() => {
      setIsDemoSpiking(false);
      setDemoVUs(25);
      setDemoRps(185);
      setDemoLatency(38);
    }, 4000);
  };

  const faqs = [
    {
      q: 'How does DevFlow generate traffic without an external cluster?',
      a: 'DevFlow utilizes an in-app bounded worker pool executing high-concurrency asynchronous fetch requests with precision sub-millisecond performance timers, reservoir percentile sampling, and browser network isolation.'
    },
    {
      q: 'How does DevFlow integrate with the existing project backend?',
      a: 'DevFlow comes pre-configured with direct target adapters to the Express core service routes (/api/devflow/health, /users, /search, /echo), allowing developers to benchmark both local and deployed microservices.'
    },
    {
      q: 'Are high-concurrency tests safe for production systems?',
      a: 'DevFlow incorporates strict safety safeguards: mandatory pre-flight authorization verification, private IP/localhost SSRF protection rules, duration hard-caps, and an instant kill-switch.'
    },
    {
      q: 'What is the difference between p50, p95, and p99 latency?',
      a: 'p50 is the median response time experienced by the typical user. p95 and p99 capture tail latencies experienced by the slowest 5% and 1% of requests—frequently exposing database lock contention, memory leaks, or garbage collection pauses that averages hide.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 dark:bg-sky-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="text-center max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-mono font-medium mb-6">
            <Activity className="w-3.5 h-3.5 text-sky-500" />
            <span>Open-Source Performance Engineering Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.15]">
            Stop Guessing Server Capacity.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400">
              Measure It.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Benchmark backend APIs, generate controlled load workloads, observe live sub-millisecond latency percentiles, and automatically diagnose database and queue bottlenecks before shipping to production.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              variant="primary"
              onClick={() => onNavigate('create-test')}
              leftIcon={<Play className="w-4 h-4" />}
            >
              Start Testing Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('dashboard')}
              leftIcon={<Activity className="w-4 h-4" />}
            >
              Live Demo Sandbox
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => onNavigate('docs')}
              leftIcon={<BookOpen className="w-4 h-4" />}
            >
              Documentation
            </Button>
          </div>

          <p className="mt-3 text-xs font-mono text-slate-500 dark:text-slate-400">
            No credit card or cloud cluster required. 100% open-source under ISC/MIT.
          </p>
        </div>

        {/* 2. Interactive Telemetry Cockpit Preview */}
        <div className="mt-14 max-w-5xl mx-auto relative z-10">
          <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-2xl overflow-hidden">
            {/* Window bar */}
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-xs text-slate-600 dark:text-slate-400 font-medium">
                  devflow-telemetry-console // target: devflow.local/api/health
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-medium">
                  {isDemoSpiking ? 'STATUS: STRESS SATURATION' : 'STATUS: NOMINAL'}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={triggerDemoSpike}
                  disabled={isDemoSpiking}
                  className="text-xs font-mono py-1"
                >
                  {isDemoSpiking ? 'Simulating Spike...' : 'Simulate Spike'}
                </Button>
              </div>
            </div>

            {/* Metrics HUD */}
            <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">Virtual Users</span>
                <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-50 tabular-nums">
                  {demoVUs} <span className="text-xs text-slate-400 font-normal">VUs</span>
                </p>
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">Throughput</span>
                <p className="text-2xl font-bold font-mono text-sky-600 dark:text-sky-400 tabular-nums">
                  {demoRps} <span className="text-xs text-slate-400 font-normal">RPS</span>
                </p>
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">p95 Latency</span>
                <p className={`text-2xl font-bold font-mono tabular-nums ${isDemoSpiking ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {demoLatency} <span className="text-xs text-slate-400 font-normal">ms</span>
                </p>
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">Error Rate</span>
                <p className={`text-2xl font-bold font-mono tabular-nums ${isDemoSpiking ? 'text-amber-500' : 'text-slate-900 dark:text-slate-50'}`}>
                  {isDemoSpiking ? '4.8%' : '0.0%'}
                </p>
              </div>
            </div>

            {/* Visualizer graphic */}
            <div className="p-6">
              <div className="h-44 sm:h-56 w-full flex items-end gap-1.5 pt-4">
                {Array.from({ length: 32 }).map((_, i) => {
                  const isSpikeCol = isDemoSpiking && i > 18;
                  const heightPercent = isSpikeCol
                    ? Math.min(95, 45 + (i - 18) * 4 + Math.sin(i) * 12)
                    : Math.min(85, 20 + Math.sin(i * 0.5) * 15 + (i * 0.8));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t transition-all duration-300 ${
                          isSpikeCol
                            ? 'bg-rose-500/80 hover:bg-rose-400'
                            : 'bg-sky-500/70 hover:bg-sky-400 dark:bg-sky-500/50'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                <span>00:00 (Start Ramp)</span>
                <span>00:15 (Steady State)</span>
                <span>00:30 (Target Ceiling)</span>
              </div>
            </div>

            {/* Note banner */}
            <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Demonstration Mode active. Live tests execute real network fetch calls.</span>
              </span>
              <button
                onClick={() => onNavigate('create-test')}
                className="text-sky-600 dark:text-sky-400 hover:underline font-medium font-mono"
              >
                Run on your API &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Problem vs Solution */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
            Why Traditional Testing Leaves You Blind
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm">
            Functional unit tests verify that code runs once. They never reveal what happens when 50 students or users hit your endpoint concurrently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Without DevFlow */}
          <Card className="border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold mb-4 text-base">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>Guessing Performance (Status Quo)</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">&times;</span>
                  <span>Testing single requests in Postman or curl gives zero indication of connection exhaustion.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">&times;</span>
                  <span>Production database pools crash under modest concurrency due to unindexed queries.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">&times;</span>
                  <span>Average latency metrics conceal devastating tail latency (p99) experienced by users.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">&times;</span>
                  <span>Complex enterprise load suites require steep DSLs, distributed clusters, and paid licenses.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* With DevFlow */}
          <Card className="border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold mb-4 text-base">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Empirical Telemetry with DevFlow</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">&check;</span>
                  <span>Real concurrent worker pools executing controlled ramp-ups and soak intervals.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">&check;</span>
                  <span>Sliding-window percentile curves (p50, p90, p95, p99) exposing exact tail degradation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">&check;</span>
                  <span>Automated heuristic diagnosis flagging throughput plateaus and connection pool limits.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">&check;</span>
                  <span>Instant browser-native execution with zero install friction and clear exportable reports.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. How It Works (4 Steps) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
            How DevFlow Works in 4 Steps
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm">
            From configuring an authorized endpoint to automated bottleneck diagnosis in under two minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-5">
            <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
              01
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Register Target</h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Add your API base URL, set environment tags (Dev, Staging), verify health connectivity, and specify safe concurrency limits.
            </p>
          </Card>

          <Card className="p-5">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
              02
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Configure Workload</h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Select Load, Stress, Spike, or Soak profiles. Tune Virtual Users (VUs), duration, ramp-up curves, pacing, and latency SLOs.
            </p>
          </Card>

          <Card className="p-5">
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
              03
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Execute & Monitor</h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Watch real-time requests per second, sliding percentile curves, and HTTP status code splits in a live telemetry cockpit.
            </p>
          </Card>

          <Card className="p-5">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
              04
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Diagnose & Compare</h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Receive automated bottleneck findings, compare against baseline test runs, and export publication-ready engineering reports.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. Core Feature Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
            Engineered for Backend Developers & SREs
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm">
            Everything you need to validate reliability without the complexity of distributed enterprise clusters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-sky-500" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Sub-Millisecond Percentiles</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Accurate p50, p90, p95, and p99 percentile calculation using reservoir quantile sampling to catch tail spikes immediately.
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Cpu className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Automated Bottleneck Detection</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Deterministic rule heuristics identify connection pool exhaustion, unindexed database scans, and throughput plateaus.
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Regression Run Comparison</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Compare baseline vs. candidate runs side-by-side with calculated absolute and percentage deltas across RPS, p95, and error rates.
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Server className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Target Management & Health Checks</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Maintain verified server inventories, configure bearer/API-key auth, and perform pre-flight latency pings before testing.
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="w-5 h-5 text-rose-500" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Responsible Testing Safeguards</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              SSRF validation guards, mandatory pre-flight safety reviews, strict concurrency clamps, and an instant kill-switch.
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Terminal className="w-5 h-5 text-sky-500" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Printable & JSON Reports</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Generate clean, audit-ready performance reports with SLA verdicts, telemetry snapshots, and configuration audit trails.
            </p>
          </Card>
        </div>
      </section>

      {/* 6. Open Source Mission */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/80">
        <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center mx-auto mb-5">
            <Github className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
            Proudly Open Source on GitHub
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Built as an open-source performance engineering initiative under the <span className="font-mono font-medium">adityasinghr651/Lab_Engineering</span> repository. Inspect the code, contribute custom workload generators, or deploy your own internal testing agent.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/adityasinghr651/Lab_Engineering"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-mono font-semibold transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Explore GitHub Repository</span>
            </a>
            <Button
              size="md"
              variant="outline"
              onClick={() => onNavigate('community')}
              leftIcon={<Users className="w-4 h-4" />}
            >
              Contributing Guide & Roadmap
            </Button>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800/80">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Card key={idx} className="p-4 sm:p-5">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-sky-500 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#090D16] py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-sky-500" />
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">DevFlow</span>
            <span className="text-[11px] font-mono">v1.0.4-oss</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 font-medium">
            <button onClick={() => onNavigate('product')} className="hover:text-slate-900 dark:hover:text-slate-100">Product</button>
            <button onClick={() => onNavigate('docs')} className="hover:text-slate-900 dark:hover:text-slate-100">Documentation</button>
            <button onClick={() => onNavigate('community')} className="hover:text-slate-900 dark:hover:text-slate-100">Community</button>
            <button onClick={() => onNavigate('legal')} className="hover:text-slate-900 dark:hover:text-slate-100">Responsible Testing</button>
            <a
              href="https://github.com/adityasinghr651/Lab_Engineering"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-slate-100"
            >
              GitHub
            </a>
          </div>

          <div>
            &copy; 2026 DevFlow Open Source Project. Designed for reliable engineering.
          </div>
        </div>
      </footer>
    </div>
  );
};
