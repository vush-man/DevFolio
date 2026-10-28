import { BottleneckFinding, TelemetryPoint, RunSummary, WorkloadProfile } from '../types';

export function analyzeTestRun(
  summary: RunSummary,
  telemetry: TelemetryPoint[],
  profile: WorkloadProfile
): BottleneckFinding[] {
  const findings: BottleneckFinding[] = [];

  if (telemetry.length < 3) {
    return findings;
  }

  // 1. Check Throughput Saturation & Latency Escalation
  const firstHalf = telemetry.slice(0, Math.floor(telemetry.length / 2));
  const secondHalf = telemetry.slice(Math.floor(telemetry.length / 2));

  const avgRpsFirst = firstHalf.reduce((acc, p) => acc + p.rps, 0) / (firstHalf.length || 1);
  const avgRpsSecond = secondHalf.reduce((acc, p) => acc + p.rps, 0) / (secondHalf.length || 1);
  const avgP95First = firstHalf.reduce((acc, p) => acc + p.p95Ms, 0) / (firstHalf.length || 1);
  const avgP95Second = secondHalf.reduce((acc, p) => acc + p.p95Ms, 0) / (secondHalf.length || 1);

  if (avgP95Second > avgP95First * 1.8 && avgRpsSecond <= avgRpsFirst * 1.15 && profile.concurrency > 10) {
    findings.push({
      id: `find-${Date.now()}-1`,
      severity: 'critical',
      category: 'throughput',
      title: 'Throughput Saturation & Queueing Delay',
      evidence: `Latency increased by ${Math.round(((avgP95Second - avgP95First) / avgP95First) * 100)}% (from ${avgP95First.toFixed(1)}ms to ${avgP95Second.toFixed(1)}ms) while throughput plateaued at ~${Math.round(avgRpsSecond)} RPS.`,
      metric: `p95 Δ: +${Math.round(avgP95Second - avgP95First)}ms`,
      timeRange: `00:${Math.floor(telemetry.length / 2).toString().padStart(2, '0')} - 00:${telemetry.length.toString().padStart(2, '0')}`,
      explanation: 'Server backend worker threads or database connection pool reached maximum concurrent capacity. Incoming requests spent excessive time waiting in HTTP/socket backlog buffers.',
      recommendation: 'Verify database connection pool limits (e.g. pg Pool max) and increase node cluster concurrency or upstream reverse-proxy worker threads.',
      confidence: 94
    });
  }

  // 2. Tail Latency Divergence (p99 vs p50)
  if (summary.p50LatencyMs > 0 && summary.p99LatencyMs > summary.p50LatencyMs * 3.8) {
    const ratio = (summary.p99LatencyMs / summary.p50LatencyMs).toFixed(1);
    findings.push({
      id: `find-${Date.now()}-2`,
      severity: summary.p99LatencyMs > 500 ? 'high' : 'medium',
      category: 'latency',
      title: 'Severe Tail Latency Disparity (p99/p50 ratio: ' + ratio + 'x)',
      evidence: `Median latency remained fast at ${summary.p50LatencyMs.toFixed(1)}ms, but the 99th percentile spiked to ${summary.p99LatencyMs.toFixed(1)}ms (${ratio}x disparity).`,
      metric: `p99: ${summary.p99LatencyMs.toFixed(1)}ms | p50: ${summary.p50LatencyMs.toFixed(1)}ms`,
      timeRange: 'Throughout test run',
      explanation: 'Disproportionate tail latency typically stems from unindexed database scans, periodic garbage collection pauses, or sporadic lock contention.',
      recommendation: 'Inspect slow query logs, review table indexes on foreign keys and filters, and verify that asynchronous tasks do not block the Node.js event loop.',
      confidence: 89
    });
  }

  // 3. Error Rate Spike / Cascades
  if (summary.errorRatePercent > 2.0 || summary.failedRequests > 0) {
    const has5xx = Object.entries(summary.statusCodes).some(([code, count]) => code.startsWith('5') && count > 0);
    findings.push({
      id: `find-${Date.now()}-3`,
      severity: summary.errorRatePercent > 5.0 ? 'critical' : 'high',
      category: 'errors',
      title: has5xx ? 'Server Error Cascade (5xx Responses Detected)' : 'Elevated HTTP Error Rate Detected',
      evidence: `${summary.failedRequests} out of ${summary.totalRequests} requests failed (${summary.errorRatePercent.toFixed(2)}% error rate). Status breakdown: ${JSON.stringify(summary.statusCodes)}`,
      metric: `Failure Rate = ${summary.errorRatePercent.toFixed(2)}%`,
      timeRange: 'Observed under peak load',
      explanation: has5xx
        ? 'Uncaught exceptions or connection timeouts in backend middleware triggered internal server errors.'
        : 'Client-side rate limiters or authentication guards rejected incoming traffic bursts.',
      recommendation: 'Inspect backend error handling middleware, verify database connection timeouts, and configure graceful rate limit backoff headers (e.g. Retry-After).',
      confidence: 96
    });
  }

  // 4. Cold-Start / Warm-up Spike
  if (telemetry.length >= 5) {
    const warmupPoints = telemetry.slice(0, 3);
    const postWarmupPoints = telemetry.slice(3);
    const avgWarmupLatency = warmupPoints.reduce((acc, p) => acc + p.p50Ms, 0) / warmupPoints.length;
    const avgSteadyLatency = postWarmupPoints.reduce((acc, p) => acc + p.p50Ms, 0) / postWarmupPoints.length;

    if (avgWarmupLatency > avgSteadyLatency * 2.2 && avgWarmupLatency > 50) {
      findings.push({
        id: `find-${Date.now()}-4`,
        severity: 'low',
        category: 'resources',
        title: 'Initial Cold-Start & JIT Warmup Penalty',
        evidence: `Initial requests averaged ${avgWarmupLatency.toFixed(1)}ms during the first 3 seconds before settling down to ${avgSteadyLatency.toFixed(1)}ms during steady state.`,
        metric: `Warmup delta: +${(avgWarmupLatency - avgSteadyLatency).toFixed(1)}ms`,
        timeRange: '00:01 - 00:03',
        explanation: 'Initial connection handshakes, JIT compilation, and first-time schema caching introduced temporary latency overhead.',
        recommendation: 'Implement synthetic health check warm-up probes prior to routing live user traffic to newly deployed server instances.',
        confidence: 82
      });
    }
  }

  // 5. SLO Threshold Breaches
  if (profile.thresholds.p95LatencyMs && summary.p95LatencyMs > profile.thresholds.p95LatencyMs) {
    findings.push({
      id: `find-${Date.now()}-5`,
      severity: 'medium',
      category: 'latency',
      title: 'Configured Latency SLO Threshold Breached',
      evidence: `Measured p95 latency (${summary.p95LatencyMs.toFixed(1)}ms) exceeded the configured target threshold of ${profile.thresholds.p95LatencyMs}ms.`,
      metric: `Target: <${profile.thresholds.p95LatencyMs}ms | Actual: ${summary.p95LatencyMs.toFixed(1)}ms`,
      timeRange: 'Overall test summary',
      explanation: 'Workload concurrency or network round-trip exceeded the capacity required to satisfy the established service level objective.',
      recommendation: 'Profile critical path query latency and consider response compression or caching layers.',
      confidence: 98
    });
  }

  return findings;
}
