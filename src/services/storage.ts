import { TestTarget, TestRun, SystemSettings } from '../types';

const TARGETS_KEY = 'devflow_targets_v1';
const RUNS_KEY = 'devflow_runs_v1';
const SETTINGS_KEY = 'devflow_settings_v1';

export const initialTargets: TestTarget[] = [
  {
    id: 'target-devflow-local',
    name: 'DevFlow Local Core API',
    baseUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
    environment: 'development',
    description: 'Internal Express core service exercising project/ routes (/api/devflow/health, /users, /echo, /search)',
    healthEndpoint: '/api/devflow/health',
    isVerified: true,
    createdAt: '2026-10-20T10:00:00Z',
    lastTestedAt: '2026-10-27T18:45:00Z',
    defaultHeaders: {
      'Content-Type': 'application/json',
      'X-DevFlow-Source': 'performance-test'
    },
    limits: {
      maxRps: 250,
      maxConcurrency: 40,
      maxDurationSeconds: 120
    }
  },
  {
    id: 'target-jsonplaceholder',
    name: 'JSONPlaceholder Microservice',
    baseUrl: 'https://jsonplaceholder.typicode.com',
    environment: 'staging',
    description: 'Public sample REST API for testing pagination, posts, and user directory latency under load',
    healthEndpoint: '/posts/1',
    isVerified: true,
    createdAt: '2026-10-22T14:30:00Z',
    lastTestedAt: '2026-10-26T12:15:00Z',
    defaultHeaders: {
      'Accept': 'application/json'
    },
    limits: {
      maxRps: 60,
      maxConcurrency: 15,
      maxDurationSeconds: 60
    }
  },
  {
    id: 'target-httpbin',
    name: 'HTTPBin Diagnostics API',
    baseUrl: 'https://httpbin.org',
    environment: 'staging',
    description: 'Diagnostic endpoints for evaluating HTTP status code distribution and simulated latency delays',
    healthEndpoint: '/status/200',
    isVerified: true,
    createdAt: '2026-10-24T09:20:00Z',
    lastTestedAt: '2026-10-27T14:10:00Z',
    defaultHeaders: {
      'User-Agent': 'DevFlow-LoadTester/1.0'
    },
    limits: {
      maxRps: 40,
      maxConcurrency: 10,
      maxDurationSeconds: 60
    }
  }
];

export const initialSettings: SystemSettings = {
  allowLocalhostTesting: true,
  enforceSsrfCheck: true,
  globalMaxVUs: 50,
  globalMaxDurationSec: 180,
  defaultPacingMs: 50,
  dataRetentionDays: 30,
  notificationWebhook: ''
};

// Seed sample historical test runs
export const initialRuns: TestRun[] = [
  {
    id: 'run-baseline-001',
    name: 'Core Health & Echo Baseline (v1.0.4)',
    targetId: 'target-devflow-local',
    targetName: 'DevFlow Local Core API',
    targetUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
    status: 'completed',
    startedAt: '2026-10-27T17:30:00Z',
    finishedAt: '2026-10-27T17:30:30Z',
    elapsedSeconds: 30,
    profile: {
      targetId: 'target-devflow-local',
      testType: 'load',
      endpointPath: '/api/devflow/health',
      method: 'GET',
      concurrency: 15,
      durationSeconds: 30,
      rampUpSeconds: 5,
      requestHeaders: {},
      pacingMs: 30,
      thresholds: {
        p95LatencyMs: 120,
        maxErrorRatePercent: 1.0,
        minRps: 100
      }
    },
    summary: {
      totalRequests: 4280,
      successfulRequests: 4276,
      failedRequests: 4,
      avgRps: 142.6,
      peakRps: 168.0,
      p50LatencyMs: 14.2,
      p90LatencyMs: 28.5,
      p95LatencyMs: 42.1,
      p99LatencyMs: 88.4,
      minLatencyMs: 6.1,
      maxLatencyMs: 142.8,
      errorRatePercent: 0.09,
      statusCodes: { '200': 4276, '500': 4 },
      thresholdResults: {
        p95Passed: true,
        errorRatePassed: true,
        rpsPassed: true
      }
    },
    telemetry: Array.from({ length: 30 }).map((_, i) => ({
      timestampMs: 1729900000000 + i * 1000,
      second: i + 1,
      activeVus: Math.min(15, Math.floor(3 + (i / 5) * 12)),
      rps: Math.round(110 + Math.sin(i * 0.4) * 25 + (i > 10 ? 30 : 0)),
      p50Ms: Math.round(12 + Math.random() * 4),
      p90Ms: Math.round(24 + Math.random() * 6),
      p95Ms: Math.round(38 + Math.random() * 8),
      p99Ms: Math.round(75 + Math.random() * 20),
      status2xx: Math.round(110 + Math.sin(i * 0.4) * 25 + (i > 10 ? 30 : 0)),
      status4xx: 0,
      status5xx: i === 18 ? 4 : 0,
      errorRate: i === 18 ? 2.5 : 0
    })),
    findings: [
      {
        id: 'find-101',
        severity: 'low',
        category: 'latency',
        title: 'Mild Tail Latency Jitter at Peak Concurrency',
        evidence: 'p99 latency reached 88.4ms during second 18 when concurrency saturated at 15 VUs',
        metric: 'p99 = 88.4ms',
        timeRange: '00:15 - 00:22',
        explanation: 'Garbage collection cycle in Node.js event loop or synchronous JSON serialization in request logger',
        recommendation: 'Evaluate asynchronous streaming for requestLogger middleware and ensure fast-json-stringify is used for large payloads.',
        confidence: 84
      }
    ],
    events: [
      { timestampMs: 1729900000000, type: 'info', message: 'Workload started: ramping up to 15 VUs' },
      { timestampMs: 1729900005000, type: 'info', message: 'Target concurrency 15 VUs reached' },
      { timestampMs: 1729900018000, type: 'warn', message: 'Transient 500 error encountered on /health ping' },
      { timestampMs: 1729900030000, type: 'info', message: 'Test execution successfully finalized' }
    ]
  },
  {
    id: 'run-stress-002',
    name: 'Search & Concurrency Stress Test',
    targetId: 'target-devflow-local',
    targetName: 'DevFlow Local Core API',
    targetUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
    status: 'completed',
    startedAt: '2026-10-27T18:15:00Z',
    finishedAt: '2026-10-27T18:15:45Z',
    elapsedSeconds: 45,
    profile: {
      targetId: 'target-devflow-local',
      testType: 'stress',
      endpointPath: '/api/devflow/search?name=test&page=1',
      method: 'GET',
      concurrency: 35,
      durationSeconds: 45,
      rampUpSeconds: 10,
      requestHeaders: {},
      pacingMs: 15,
      thresholds: {
        p95LatencyMs: 250,
        maxErrorRatePercent: 5.0,
        minRps: 150
      }
    },
    summary: {
      totalRequests: 8940,
      successfulRequests: 8460,
      failedRequests: 480,
      avgRps: 198.6,
      peakRps: 245.0,
      p50LatencyMs: 48.6,
      p90LatencyMs: 182.0,
      p95LatencyMs: 340.5,
      p99LatencyMs: 610.2,
      minLatencyMs: 12.0,
      maxLatencyMs: 1250.0,
      errorRatePercent: 5.37,
      statusCodes: { '200': 8460, '500': 480 },
      thresholdResults: {
        p95Passed: false,
        errorRatePassed: false,
        rpsPassed: true
      }
    },
    telemetry: Array.from({ length: 45 }).map((_, i) => {
      const isSaturated = i > 25;
      return {
        timestampMs: 1729903000000 + i * 1000,
        second: i + 1,
        activeVus: Math.min(35, Math.floor(5 + (i / 10) * 30)),
        rps: isSaturated ? Math.round(180 + Math.random() * 20) : Math.round(100 + i * 4.5),
        p50Ms: Math.round(35 + (isSaturated ? 30 : 5)),
        p90Ms: Math.round(90 + (isSaturated ? 120 : 15)),
        p95Ms: Math.round(140 + (isSaturated ? 220 : 25)),
        p99Ms: Math.round(220 + (isSaturated ? 410 : 40)),
        status2xx: isSaturated ? 170 : Math.round(100 + i * 4.5),
        status4xx: 0,
        status5xx: isSaturated ? Math.round(15 + Math.random() * 10) : 0,
        errorRate: isSaturated ? Number((8 + Math.random() * 3).toFixed(1)) : 0
      };
    }),
    findings: [
      {
        id: 'find-201',
        severity: 'critical',
        category: 'throughput',
        title: 'Connection Pool Saturation & Queueing Delay',
        evidence: 'Throughput plateaued at 245 RPS while p95 response time rose from 140ms to 340ms past 25 VUs',
        metric: 'p95 = 340.5ms (>250ms threshold), Error = 5.37%',
        timeRange: '00:26 - 00:45',
        explanation: 'PostgreSQL connection pool default size (max: 10 in db.js) was exhausted by concurrent queries, forcing requests to queue in memory.',
        recommendation: 'Increase PostgreSQL pool size to 25-30 connections in src/config/db.js and introduce Redis caching for common search parameters.',
        confidence: 96
      },
      {
        id: 'find-202',
        severity: 'high',
        category: 'errors',
        title: 'Spike in 500 Internal Server Errors Under Saturation',
        evidence: '480 requests failed with HTTP 500 when active concurrency exceeded 28 VUs',
        metric: '5xx count = 480',
        timeRange: '00:28 - 00:45',
        explanation: 'Database connection timeout errors unhandled in repository queries causing Express error handler to emit 500 responses.',
        recommendation: 'Implement circuit breaker pattern and add bounded query timeout (e.g. statement_timeout = 2000ms) with explicit error fallback.',
        confidence: 92
      }
    ],
    events: [
      { timestampMs: 1729903000000, type: 'info', message: 'Stress test initiated. Target max concurrency: 35 VUs' },
      { timestampMs: 1729903010000, type: 'info', message: 'Ramp-up complete (35 active VUs)' },
      { timestampMs: 1729903026000, type: 'warn', message: 'p95 threshold breached (> 250ms)' },
      { timestampMs: 1729903028000, type: 'error', message: 'Cluster of 500 errors detected from backend' },
      { timestampMs: 1729903045000, type: 'info', message: 'Stress test run concluded' }
    ]
  }
];

export const getStoredTargets = (): TestTarget[] => {
  try {
    const raw = localStorage.getItem(TARGETS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading targets from storage:', e);
  }
  return initialTargets;
};

export const saveStoredTargets = (targets: TestTarget[]) => {
  try {
    localStorage.setItem(TARGETS_KEY, JSON.stringify(targets));
  } catch (e) {
    console.error('Error saving targets to storage:', e);
  }
};

export const getStoredRuns = (): TestRun[] => {
  try {
    const raw = localStorage.getItem(RUNS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading runs from storage:', e);
  }
  return initialRuns;
};

export const saveStoredRuns = (runs: TestRun[]) => {
  try {
    localStorage.setItem(RUNS_KEY, JSON.stringify(runs));
  } catch (e) {
    console.error('Error saving runs to storage:', e);
  }
};

export const getStoredSettings = (): SystemSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading settings:', e);
  }
  return initialSettings;
};

export const saveStoredSettings = (settings: SystemSettings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
};
