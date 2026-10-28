export type ThemeMode = 'light' | 'dark' | 'system';

export type TargetEnvironment = 'development' | 'staging' | 'production';

export interface TargetAuthConfig {
  type: 'none' | 'bearer' | 'basic' | 'apiKey';
  token?: string;
  headerName?: string;
  username?: string;
  password?: string;
}

export interface TargetLimits {
  maxRps: number;
  maxConcurrency: number;
  maxDurationSeconds: number;
}

export interface TestTarget {
  id: string;
  name: string;
  baseUrl: string;
  environment: TargetEnvironment;
  description: string;
  healthEndpoint?: string;
  isVerified: boolean;
  createdAt: string;
  lastTestedAt?: string;
  defaultHeaders?: Record<string, string>;
  authConfig?: TargetAuthConfig;
  limits: TargetLimits;
}

export type TestType = 'load' | 'stress' | 'spike' | 'soak';

export interface WorkloadProfile {
  targetId: string;
  testType: TestType;
  endpointPath: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  concurrency: number; // Virtual Users (VUs)
  durationSeconds: number;
  rampUpSeconds: number;
  requestHeaders: Record<string, string>;
  requestBody?: string;
  pacingMs: number;
  thresholds: {
    p95LatencyMs?: number;
    maxErrorRatePercent?: number;
    minRps?: number;
  };
}

export interface TelemetryPoint {
  timestampMs: number;
  second: number;
  activeVus: number;
  rps: number;
  p50Ms: number;
  p90Ms: number;
  p95Ms: number;
  p99Ms: number;
  status2xx: number;
  status4xx: number;
  status5xx: number;
  errorRate: number;
}

export type FindingSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface BottleneckFinding {
  id: string;
  severity: FindingSeverity;
  category: 'latency' | 'throughput' | 'errors' | 'concurrency' | 'resources';
  title: string;
  evidence: string;
  metric: string;
  timeRange: string;
  explanation: string;
  recommendation: string;
  confidence: number; // 0 - 100%
}

export type RunStatus = 'pending' | 'running' | 'paused' | 'completed' | 'cancelled' | 'failed';

export interface RunSummary {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgRps: number;
  peakRps: number;
  p50LatencyMs: number;
  p90LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  minLatencyMs: number;
  maxLatencyMs: number;
  errorRatePercent: number;
  statusCodes: Record<string, number>;
  thresholdResults: {
    p95Passed?: boolean;
    errorRatePassed?: boolean;
    rpsPassed?: boolean;
  };
}

export interface TestRun {
  id: string;
  name: string;
  targetId: string;
  targetName: string;
  targetUrl: string;
  status: RunStatus;
  profile: WorkloadProfile;
  startedAt: string;
  finishedAt?: string;
  elapsedSeconds: number;
  summary: RunSummary;
  telemetry: TelemetryPoint[];
  findings: BottleneckFinding[];
  events: Array<{
    timestampMs: number;
    type: 'info' | 'warn' | 'error';
    message: string;
  }>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar?: string;
  organization: string;
}

export interface SystemSettings {
  allowLocalhostTesting: boolean;
  enforceSsrfCheck: boolean;
  globalMaxVUs: number;
  globalMaxDurationSec: number;
  defaultPacingMs: number;
  dataRetentionDays: number;
  notificationWebhook?: string;
}

export type NavigationRoute = 
  | 'landing'
  | 'product'
  | 'docs'
  | 'community'
  | 'auth'
  | 'legal'
  | 'dashboard'
  | 'targets'
  | 'create-test'
  | 'monitor'
  | 'results'
  | 'analysis'
  | 'reports'
  | 'comparisons'
  | 'settings';
