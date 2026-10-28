/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

// Views
import { HomeView } from './views/public/HomeView';
import { ProductView } from './views/public/ProductView';
import { DocsView } from './views/public/DocsView';
import { CommunityView } from './views/public/CommunityView';
import { AuthView } from './views/public/AuthView';
import { LegalView } from './views/public/LegalView';

import { DashboardView } from './views/app/DashboardView';
import { TargetsView } from './views/app/TargetsView';
import { CreateTestView } from './views/app/CreateTestView';
import { LiveMonitorView } from './views/app/LiveMonitorView';
import { TestResultsView } from './views/app/TestResultsView';
import { AnalysisView } from './views/app/AnalysisView';
import { ReportsView } from './views/app/ReportsView';
import { ComparisonsView } from './views/app/ComparisonsView';
import { SettingsView } from './views/app/SettingsView';

// Services & Types
import {
  TestTarget,
  TestRun,
  WorkloadProfile,
  TelemetryPoint,
  RunSummary,
  SystemSettings,
  NavigationRoute
} from './types';
import {
  getStoredTargets,
  saveStoredTargets,
  getStoredRuns,
  saveStoredRuns,
  getStoredSettings,
  saveStoredSettings,
  initialTargets,
  initialRuns,
  initialSettings
} from './services/storage';
import { LoadEngine } from './services/loadEngine';

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<NavigationRoute>('landing');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Stored state
  const [targets, setTargets] = useState<TestTarget[]>(getStoredTargets);
  const [runs, setRuns] = useState<TestRun[]>(getStoredRuns);
  const [settings, setSettings] = useState<SystemSettings>(getStoredSettings);

  // Active selections
  const [selectedTarget, setSelectedTarget] = useState<TestTarget | undefined>(targets[0]);
  const [selectedRun, setSelectedRun] = useState<TestRun | null>(runs[0] || null);

  // Live Load Engine State
  const [activeEngine, setActiveEngine] = useState<LoadEngine | null>(null);
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [liveRun, setLiveRun] = useState<TestRun | null>(null);
  const [liveTelemetry, setLiveTelemetry] = useState<TelemetryPoint[]>([]);
  const [liveSummary, setLiveSummary] = useState<RunSummary | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [totalDurationSeconds, setTotalDurationSeconds] = useState<number>(30);

  // Save changes to localStorage
  useEffect(() => {
    saveStoredTargets(targets);
  }, [targets]);

  useEffect(() => {
    saveStoredRuns(runs);
  }, [runs]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  // Target handlers
  const handleAddTarget = (newTarget: TestTarget) => {
    setTargets(prev => [newTarget, ...prev]);
  };

  const handleDeleteTarget = (targetId: string) => {
    setTargets(prev => prev.filter(t => t.id !== targetId));
  };

  // Launch real test workload
  const handleLaunchTest = (profile: WorkloadProfile, target: TestTarget) => {
    // Reset live state
    setLiveTelemetry([]);
    setLiveSummary(null);
    setElapsedSeconds(0);
    setTotalDurationSeconds(profile.durationSeconds);
    setIsTestRunning(true);
    setIsPaused(false);

    const draftRun: TestRun = {
      id: `run-${Date.now().toString(36)}`,
      name: `${profile.testType.toUpperCase()} Test - ${target.name}`,
      targetId: target.id,
      targetName: target.name,
      targetUrl: target.baseUrl,
      status: 'running',
      profile,
      startedAt: new Date().toISOString(),
      elapsedSeconds: 0,
      summary: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        avgRps: 0,
        peakRps: 0,
        p50LatencyMs: 0,
        p90LatencyMs: 0,
        p95LatencyMs: 0,
        p99LatencyMs: 0,
        minLatencyMs: 0,
        maxLatencyMs: 0,
        errorRatePercent: 0,
        statusCodes: {},
        thresholdResults: {
          p95Passed: true,
          errorRatePassed: true
        }
      },
      telemetry: [],
      findings: [],
      events: [{ timestampMs: Date.now(), type: 'info', message: 'Test execution initiated' }]
    };

    setLiveRun(draftRun);
    setCurrentRoute('monitor');

    // Instantiate and launch real engine
    const engine = new LoadEngine(target, profile, {
      onTick: (point, summary, elapsed) => {
        setElapsedSeconds(elapsed);
        setLiveSummary(summary);
        setLiveTelemetry(prev => [...prev, point]);
        setLiveRun(prev => prev ? {
          ...prev,
          elapsedSeconds: elapsed,
          summary,
          telemetry: [...prev.telemetry, point]
        } : null);
      },
      onEvent: (type, message) => {
        setLiveRun(prev => prev ? {
          ...prev,
          events: [...prev.events, { timestampMs: Date.now(), type, message }]
        } : null);
      },
      onComplete: (finalRun) => {
        setIsTestRunning(false);
        setActiveEngine(null);
        setLiveRun(finalRun);
        setSelectedRun(finalRun);

        // Prepend to runs history
        setRuns(prev => [finalRun, ...prev]);

        // Update target last tested timestamp
        setTargets(prev => prev.map(t => t.id === target.id ? { ...t, lastTestedAt: new Date().toISOString() } : t));
      },
      onError: (err) => {
        console.error('Load engine runtime error:', err);
        setIsTestRunning(false);
      }
    });

    setActiveEngine(engine);
    engine.start();
  };

  const handlePauseToggle = () => {
    if (activeEngine) {
      activeEngine.pause();
      setIsPaused(!isPaused);
    }
  };

  const handleAbort = () => {
    if (activeEngine) {
      activeEngine.stop('cancelled');
      setIsTestRunning(false);
      setActiveEngine(null);
    }
  };

  const handleResetData = () => {
    localStorage.removeItem('devflow_targets_v1');
    localStorage.removeItem('devflow_runs_v1');
    localStorage.removeItem('devflow_settings_v1');
    setTargets(initialTargets);
    setRuns(initialRuns);
    setSettings(initialSettings);
    setSelectedRun(initialRuns[0]);
  };

  const isAppView = [
    'dashboard', 'targets', 'create-test', 'monitor', 'results',
    'analysis', 'reports', 'comparisons', 'settings'
  ].includes(currentRoute);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Top Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={setCurrentRoute}
        isTestRunning={isTestRunning}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar only rendered when in authenticated app views */}
        {isAppView && (
          <Sidebar
            currentRoute={currentRoute}
            onNavigate={setCurrentRoute}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isTestRunning={isTestRunning}
            activeTargetsCount={targets.length}
            totalRunsCount={runs.length}
          />
        )}

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Public Views */}
          {currentRoute === 'landing' && <HomeView onNavigate={setCurrentRoute} />}
          {currentRoute === 'product' && <ProductView onNavigate={setCurrentRoute} />}
          {currentRoute === 'docs' && <DocsView onNavigate={setCurrentRoute} />}
          {currentRoute === 'community' && <CommunityView onNavigate={setCurrentRoute} />}
          {currentRoute === 'auth' && <AuthView onNavigate={setCurrentRoute} />}
          {currentRoute === 'legal' && <LegalView onNavigate={setCurrentRoute} />}

          {/* Authenticated Dashboard Screens */}
          {isAppView && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
              {currentRoute === 'dashboard' && (
                <DashboardView
                  targets={targets}
                  runs={runs}
                  onNavigate={setCurrentRoute}
                  onSelectRun={setSelectedRun}
                  isTestRunning={isTestRunning}
                />
              )}

              {currentRoute === 'targets' && (
                <TargetsView
                  targets={targets}
                  onAddTarget={handleAddTarget}
                  onDeleteTarget={handleDeleteTarget}
                  onNavigate={setCurrentRoute}
                  onSelectTargetForTest={setSelectedTarget}
                />
              )}

              {currentRoute === 'create-test' && (
                <CreateTestView
                  targets={targets}
                  selectedTarget={selectedTarget}
                  onLaunchTest={handleLaunchTest}
                  onNavigate={setCurrentRoute}
                />
              )}

              {currentRoute === 'monitor' && (
                <LiveMonitorView
                  currentRun={liveRun || selectedRun}
                  telemetry={liveTelemetry.length > 0 ? liveTelemetry : (selectedRun?.telemetry || [])}
                  summary={liveSummary || selectedRun?.summary || null}
                  elapsedSeconds={elapsedSeconds || selectedRun?.elapsedSeconds || 0}
                  totalDurationSeconds={totalDurationSeconds || selectedRun?.profile.durationSeconds || 30}
                  isRunning={isTestRunning}
                  isPaused={isPaused}
                  onPauseToggle={handlePauseToggle}
                  onAbort={handleAbort}
                  onNavigate={setCurrentRoute}
                />
              )}

              {currentRoute === 'results' && (
                <TestResultsView
                  run={selectedRun || runs[0]}
                  onNavigate={setCurrentRoute}
                  onSelectRunForComparison={(r) => { setSelectedRun(r); }}
                  onRetest={(r) => {
                    const target = targets.find(t => t.id === r.targetId) || targets[0];
                    setSelectedTarget(target);
                    setCurrentRoute('create-test');
                  }}
                />
              )}

              {currentRoute === 'analysis' && (
                <AnalysisView
                  runs={runs}
                  selectedRun={selectedRun}
                  onSelectRun={setSelectedRun}
                  onNavigate={setCurrentRoute}
                />
              )}

              {currentRoute === 'reports' && (
                <ReportsView
                  runs={runs}
                  selectedRun={selectedRun}
                  onSelectRun={setSelectedRun}
                  onNavigate={setCurrentRoute}
                />
              )}

              {currentRoute === 'comparisons' && (
                <ComparisonsView
                  runs={runs}
                  baselineRunId={selectedRun?.id}
                  onNavigate={setCurrentRoute}
                />
              )}

              {currentRoute === 'settings' && (
                <SettingsView
                  settings={settings}
                  onUpdateSettings={setSettings}
                  onResetData={handleResetData}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
