import { TestTarget, WorkloadProfile, TelemetryPoint, RunSummary, TestRun } from '../types';
import { analyzeTestRun } from './analyzer';

export interface LoadEngineCallbacks {
  onTick: (point: TelemetryPoint, currentSummary: RunSummary, elapsedSec: number) => void;
  onEvent: (type: 'info' | 'warn' | 'error', message: string) => void;
  onComplete: (finalRun: TestRun) => void;
  onError: (error: Error) => void;
}

export class LoadEngine {
  private target: TestTarget;
  private profile: WorkloadProfile;
  private callbacks: LoadEngineCallbacks;
  
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private startTimeMs: number = 0;
  private intervalTimer: any = null;
  private workerAbortControllers: AbortController[] = [];

  // Aggregated metrics
  private totalRequests: number = 0;
  private successfulRequests: number = 0;
  private failedRequests: number = 0;
  private statusCodes: Record<string, number> = {};
  private allLatenciesMs: number[] = [];
  private currentSecondLatencies: number[] = [];
  private currentSecondRequests: number = 0;
  private currentSecond2xx: number = 0;
  private currentSecond4xx: number = 0;
  private currentSecond5xx: number = 0;
  private telemetryHistory: TelemetryPoint[] = [];
  private eventLogs: Array<{ timestampMs: number; type: 'info' | 'warn' | 'error'; message: string }> = [];

  constructor(target: TestTarget, profile: WorkloadProfile, callbacks: LoadEngineCallbacks) {
    this.target = target;
    this.profile = profile;
    this.callbacks = callbacks;
  }

  public async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isPaused = false;
    this.startTimeMs = Date.now();

    this.logEvent('info', `Starting ${this.profile.testType.toUpperCase()} test on ${this.target.name}`);
    this.logEvent('info', `Target: ${this.target.baseUrl}${this.profile.endpointPath} with max ${this.profile.concurrency} VUs for ${this.profile.durationSeconds}s`);

    // Start 1-second telemetry sampling interval
    let elapsedSeconds = 0;
    this.intervalTimer = setInterval(() => {
      if (!this.isRunning || this.isPaused) return;
      elapsedSeconds++;

      // Compute percentiles for this second
      const secP50 = this.getPercentile(this.currentSecondLatencies, 50);
      const secP90 = this.getPercentile(this.currentSecondLatencies, 90);
      const secP95 = this.getPercentile(this.currentSecondLatencies, 95);
      const secP99 = this.getPercentile(this.currentSecondLatencies, 99);

      const rps = this.currentSecondRequests;
      const errorRate = this.currentSecondRequests > 0
        ? Number((((this.currentSecond4xx + this.currentSecond5xx) / this.currentSecondRequests) * 100).toFixed(1))
        : 0;

      const activeVUs = this.calculateCurrentVUs(elapsedSeconds);

      const point: TelemetryPoint = {
        timestampMs: Date.now(),
        second: elapsedSeconds,
        activeVus: activeVUs,
        rps,
        p50Ms: secP50,
        p90Ms: secP90,
        p95Ms: secP95,
        p99Ms: secP99,
        status2xx: this.currentSecond2xx,
        status4xx: this.currentSecond4xx,
        status5xx: this.currentSecond5xx,
        errorRate
      };

      this.telemetryHistory.push(point);

      // Check for live warning anomalies
      if (point.status5xx > 0) {
        this.logEvent('warn', `Received ${point.status5xx} 5xx server errors at second ${elapsedSeconds}`);
      }
      if (this.profile.thresholds.p95LatencyMs && secP95 > this.profile.thresholds.p95LatencyMs) {
        this.logEvent('warn', `p95 latency (${secP95}ms) breached target threshold (${this.profile.thresholds.p95LatencyMs}ms)`);
      }

      // Reset current second counters
      this.currentSecondRequests = 0;
      this.currentSecond2xx = 0;
      this.currentSecond4xx = 0;
      this.currentSecond5xx = 0;
      this.currentSecondLatencies = [];

      // Update current summary
      const summary = this.buildSummary();
      this.callbacks.onTick(point, summary, elapsedSeconds);

      // Check completion
      if (elapsedSeconds >= this.profile.durationSeconds) {
        this.stop('completed');
      }
    }, 1000);

    // Launch worker loops
    this.spawnWorkers();
  }

  public pause(): void {
    if (!this.isRunning) return;
    this.isPaused = !this.isPaused;
    this.logEvent('info', this.isPaused ? 'Workload paused by operator' : 'Workload resumed by operator');
  }

  public stop(status: 'completed' | 'cancelled' | 'failed' = 'cancelled'): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }

    // Abort active fetch requests
    for (const controller of this.workerAbortControllers) {
      try {
        controller.abort();
      } catch {
        // ignore
      }
    }
    this.workerAbortControllers = [];

    this.logEvent(status === 'completed' ? 'info' : 'warn', `Load test ended with status: ${status}`);

    const finalSummary = this.buildSummary();
    const findings = analyzeTestRun(finalSummary, this.telemetryHistory, this.profile);

    const testRun: TestRun = {
      id: `run-${Date.now().toString(36)}`,
      name: `${this.profile.testType.toUpperCase()} Test - ${this.target.name}`,
      targetId: this.target.id,
      targetName: this.target.name,
      targetUrl: this.target.baseUrl,
      status,
      profile: this.profile,
      startedAt: new Date(this.startTimeMs).toISOString(),
      finishedAt: new Date().toISOString(),
      elapsedSeconds: Math.max(1, Math.round((Date.now() - this.startTimeMs) / 1000)),
      summary: finalSummary,
      telemetry: this.telemetryHistory,
      findings,
      events: this.eventLogs
    };

    this.callbacks.onComplete(testRun);
  }

  private calculateCurrentVUs(elapsedSeconds: number): number {
    if (this.profile.rampUpSeconds <= 0) return this.profile.concurrency;
    if (elapsedSeconds >= this.profile.rampUpSeconds) return this.profile.concurrency;
    return Math.max(1, Math.round((elapsedSeconds / this.profile.rampUpSeconds) * this.profile.concurrency));
  }

  private spawnWorkers(): void {
    const totalWorkers = Math.min(this.profile.concurrency, 50); // Bound concurrency safely

    for (let workerId = 0; workerId < totalWorkers; workerId++) {
      this.runWorkerLoop(workerId);
    }
  }

  private async runWorkerLoop(workerId: number): Promise<void> {
    const fullUrl = this.buildTargetUrl();
    const headers: Record<string, string> = {
      ...this.target.defaultHeaders,
      ...this.profile.requestHeaders
    };

    if (this.target.authConfig && this.target.authConfig.type === 'bearer' && this.target.authConfig.token) {
      headers['Authorization'] = `Bearer ${this.target.authConfig.token}`;
    }

    // Worker pacing
    const basePacing = Math.max(10, this.profile.pacingMs || 30);

    while (this.isRunning) {
      if (this.isPaused) {
        await new Promise(r => setTimeout(r, 200));
        continue;
      }

      // Check ramp-up: if workerId exceeds active VUs, wait a short tick
      const elapsed = (Date.now() - this.startTimeMs) / 1000;
      const targetVUs = this.calculateCurrentVUs(elapsed);
      if (workerId >= targetVUs) {
        await new Promise(r => setTimeout(r, 200));
        continue;
      }

      const controller = new AbortController();
      this.workerAbortControllers.push(controller);
      const reqStart = performance.now();

      try {
        const fetchOptions: RequestInit = {
          method: this.profile.method,
          headers,
          signal: controller.signal
        };

        if (this.profile.method !== 'GET' && this.profile.requestBody) {
          fetchOptions.body = this.profile.requestBody;
        }

        const res = await fetch(fullUrl, fetchOptions);
        const reqEnd = performance.now();
        const latencyMs = Math.max(1, Math.round((reqEnd - reqStart) * 10) / 10);

        // Record metrics
        this.recordResult(res.status, latencyMs);
      } catch (err: any) {
        if (!this.isRunning) break;
        const reqEnd = performance.now();
        const latencyMs = Math.max(1, Math.round((reqEnd - reqStart) * 10) / 10);

        if (err.name === 'AbortError') {
          break;
        }

        // Network error or CORS or connection refused
        this.recordResult(503, latencyMs);
      } finally {
        const idx = this.workerAbortControllers.indexOf(controller);
        if (idx > -1) this.workerAbortControllers.splice(idx, 1);
      }

      // Worker sleep/pacing before next request
      const jitter = Math.floor(Math.random() * 15);
      await new Promise(r => setTimeout(r, basePacing + jitter));
    }
  }

  private recordResult(statusCode: number, latencyMs: number): void {
    this.totalRequests++;
    this.currentSecondRequests++;
    this.allLatenciesMs.push(latencyMs);
    this.currentSecondLatencies.push(latencyMs);

    const codeStr = statusCode.toString();
    this.statusCodes[codeStr] = (this.statusCodes[codeStr] || 0) + 1;

    if (statusCode >= 200 && statusCode < 400) {
      this.successfulRequests++;
      this.currentSecond2xx++;
    } else {
      this.failedRequests++;
      if (statusCode >= 400 && statusCode < 500) {
        this.currentSecond4xx++;
      } else {
        this.currentSecond5xx++;
      }
    }
  }

  private buildTargetUrl(): string {
    const base = this.target.baseUrl.replace(/\/+$/, '');
    const path = this.profile.endpointPath.startsWith('/')
      ? this.profile.endpointPath
      : `/${this.profile.endpointPath}`;
    return `${base}${path}`;
  }

  private getPercentile(values: number[], percentile: number): number {
    if (!values || values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
  }

  private buildSummary(): RunSummary {
    const elapsedSec = Math.max(1, (Date.now() - this.startTimeMs) / 1000);
    const avgRps = Number((this.totalRequests / elapsedSec).toFixed(1));
    const peakRps = this.telemetryHistory.reduce((max, p) => Math.max(max, p.rps), 0);

    const p50 = this.getPercentile(this.allLatenciesMs, 50);
    const p90 = this.getPercentile(this.allLatenciesMs, 90);
    const p95 = this.getPercentile(this.allLatenciesMs, 95);
    const p99 = this.getPercentile(this.allLatenciesMs, 99);

    const minLatency = this.allLatenciesMs.length > 0 ? Math.min(...this.allLatenciesMs) : 0;
    const maxLatency = this.allLatenciesMs.length > 0 ? Math.max(...this.allLatenciesMs) : 0;

    const errorRatePercent = this.totalRequests > 0
      ? Number(((this.failedRequests / this.totalRequests) * 100).toFixed(2))
      : 0;

    const p95Passed = this.profile.thresholds.p95LatencyMs
      ? p95 <= this.profile.thresholds.p95LatencyMs
      : true;

    const errorRatePassed = this.profile.thresholds.maxErrorRatePercent !== undefined
      ? errorRatePercent <= this.profile.thresholds.maxErrorRatePercent
      : true;

    const rpsPassed = this.profile.thresholds.minRps !== undefined
      ? avgRps >= this.profile.thresholds.minRps
      : true;

    return {
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      failedRequests: this.failedRequests,
      avgRps,
      peakRps: Math.max(peakRps, avgRps),
      p50LatencyMs: p50,
      p90LatencyMs: p90,
      p95LatencyMs: p95,
      p99LatencyMs: p99,
      minLatencyMs: minLatency,
      maxLatencyMs: maxLatency,
      errorRatePercent,
      statusCodes: { ...this.statusCodes },
      thresholdResults: {
        p95Passed,
        errorRatePassed,
        rpsPassed
      }
    };
  }

  private logEvent(type: 'info' | 'warn' | 'error', message: string): void {
    const entry = { timestampMs: Date.now(), type, message };
    this.eventLogs.push(entry);
    this.callbacks.onEvent(type, message);
  }
}
