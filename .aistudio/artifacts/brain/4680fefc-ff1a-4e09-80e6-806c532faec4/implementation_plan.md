# DevFlow — Open-Source Server Performance Engineering & Testing Platform

An open-source performance engineering platform that empowers backend developers, SREs, and engineering students to benchmark APIs, execute controlled load tests, visualize high-precision real-time telemetry, diagnose bottlenecks, and generate comprehensive reliability reports.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX choices have been synthesized based on your specifications and Turn 1 clarifications:

- **Confirmed Brand & Identity**: Pivoting the project into **DevFlow** — a developer-first, precision-engineered performance testing and telemetry platform (replacing generic issue tracking with server performance observability and load generation).
- **Confirmed Execution Engine**: Real-time **in-app controlled load testing engine** executing actual HTTP fetches with concurrent worker pools, accurate sub-millisecond timer resolution, sliding-window percentiles (p50, p90, p95, p99), and live streaming telemetry charts.
- **Confirmed Default Targets**: Pre-configured verified test targets including:
  1. **DevFlow Local Core API** (`/health`, `/echo`, `/users/:id`, `/search` from the audited `project/` backend)
  2. **JSONPlaceholder REST API** (`/posts`, `/comments`, `/users`)
  3. **HTTPBin Diagnostic API** (`/delay/1`, `/status/200`, `/status/500`, `/bytes/1024`)
- **Safety & Authorization System**: Enforced authorization headers, private IP SSRF safeguards, configurable request rate limits (max RPS), duration caps, concurrency clamps, and an explicit pre-launch Safety Review step.
- **Complete Theme Architecture**: Universal **Light / Dark / System** theme system driven by CSS variables and Tailwind tokens across all public pages, authenticated dashboard screens, telemetry graphs, and modal dialogs with zero theme-flicker on load.

---

## 1. Overview & Core Concept

### What It Does
DevFlow bridges the gap between complex infrastructure testing tools (like k6, Grafana, and Datadog) and developer simplicity. Users can add authorized API targets, configure realistic traffic workloads (load, stress, spike, and soak), execute tests in real-time, inspect live percentiles and error rates, pinpoint architectural bottlenecks (high latency, throughput saturation, 5xx errors), compare baseline vs. regression test runs, and export publication-ready engineering reports.

### Target Audience / Persona
- **Students & Aspiring Engineers**: Learning backend concurrency, connection pooling, and latency distributions under load.
- **Backend & API Engineers**: Profiling Express, Go, Fastify, or Django services before merging pull requests.
- **DevOps & Site Reliability Engineers (SREs)**: Verifying service level objectives (SLOs), error budgets, and capacity thresholds.

### Key Value
- **No Guesswork**: Measures actual empirical latency curves and error thresholds under controlled concurrency.
- **Preserved Backend Foundation**: Directly connects to and exercises the audited `project/` backend architecture while establishing the new performance engineering capability.
- **Zero Mock Metrics in Live Mode**: Live execution runs real asynchronous HTTP calls with live metric aggregation, accurate percentiles, and true status code breakdowns.

---

## 2. User Experience & Visual Design

### Key User Flows

```
[Public Landing] ──> [Documentation / Guides] ──> [Sign In / Register]
       │                                                    │
       ▼                                                    ▼
[Live Demo Sandbox] ────────────────────────────────> [App Shell]
                                                            │
    ┌───────────────────────────────┬───────────────────────┼──────────────────────────────┐
    ▼                               ▼                       ▼                              ▼
[Targets & Servers]         [Create Test Wizard]     [Live Monitor]               [Analysis & Reports]
 • Register API Target       • 1. Select Target       • Active RPS & VUs           • Bottleneck Detection
 • Health Ping & Verify      • 2. Choose Test Type    • p50 / p95 / p99 Curves     • Latency Distribution
 • SSRF & Safe Caps          • 3. Workload Tuning     • Status Code Splits         • Run Comparisons
                             • 4. Safety Review       • Abort / Pause Control      • Printable PDF/JSON Export
                             • 5. Launch Run
```

1. **Discovery & Onboarding**: Public landing page communicating value, feature matrices, interactive metrics playground, architecture overview, and complete documentation.
2. **Target Setup & Verification**: Users register target servers (e.g. `http://localhost:3000` or public APIs), verify connectivity, set environment tags (Dev, Staging, Production), and establish safe RPS/VU ceiling limits.
3. **5-Step Test Wizard**: 
   - *Step 1: Target Selection*: Pick an active verified target.
   - *Step 2: Test Pattern*: Choose Load Test (stable ramp), Stress Test (capacity cliff search), Spike Test (sudden surge), or Soak Test (endurance & leak detection).
   - *Step 3: Workload Parameters*: Virtual Users (VUs), duration, ramp-up time, HTTP method, payload, headers, pacing/sleep, and latency SLO thresholds.
   - *Step 4: Safety & Authorization Review*: Acknowledge target authorization, review estimated request volumes, verify host isolation, and confirm safe limits.
   - *Step 5: Launch & Arm*: Pre-flight connectivity check and transition to the Live Telemetry Console.
4. **Live Execution & Telemetry**: Real-time cockpit displaying running RPS, active concurrency, sub-second p50/p95/p99 latency charts, error rates, HTTP status breakdown (2xx/4xx/5xx), and instant kill-switch.
5. **Post-Run Diagnosis & Analysis**: Automated diagnostic rules detecting latency degradation, cold-start spikes, connection exhaustion, and threshold breaches with confidence scoring and mitigation guidance.
6. **Comparisons & Reporting**: Side-by-side run differential comparisons ($\Delta$ RPS, $\Delta$ p95 latency, $\Delta$ error rate) and clean exportable reports.

### Visual Identity & Theme
Inspired by **Grafana, Linear, and Datadog**, the UI uses an ultra-clean, information-dense technical aesthetic:

- **Aesthetic Direction**: High-density engineering console, crisp 1px borders, subtle data grids, tabular monospace numerals for all telemetry values, and restrained status accents.
- **Color Palette & Theme Tokens**:
  - *Dark Mode (Default SRE aesthetic)*:
    - Base canvas: `#090D16` (Deep technical slate)
    - Surface / Card: `#0F172A` (Rich slate)
    - Elevated Surface / Modal: `#1E293B`
    - Subtle Border: `#334155`
    - Text Primary: `#F8FAFC`
    - Text Muted: `#94A3B8`
    - Accent / Brand: `#38BDF8` (Electric Sky)
    - Nominal / 2xx: `#22C55E` (Emerald)
    - Warning / 4xx: `#F59E0B` (Amber)
    - Critical / 5xx: `#EF4444` (Crimson)
  - *Light Mode*:
    - Base canvas: `#F8FAFC`
    - Surface / Card: `#FFFFFF`
    - Elevated Surface / Modal: `#FFFFFF`
    - Subtle Border: `#E2E8F0`
    - Text Primary: `#0F172A`
    - Text Muted: `#64748B`
    - Accent / Brand: `#0284C7`
- **Typography & Tabular Numbers**:
  - Sans display & headings: Clean high-legibility system sans (`Plus Jakarta Sans`, `Inter`, `system-ui`).
  - Monospace telemetry figures: Monospace font (`JetBrains Mono`, `ui-monospace`, `tabular-nums`) for all latencies, timestamps, request counts, and status codes to avoid layout jitter.
- **Zero-Pill Discipline & Restraint**:
  - Metric badges and status indicators use subtle border-left or micro dot markers rather than heavy candy-colored pills.
  - Generous padding and structured data grids with crisp column alignment.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Browser-Controlled Real Concurrency Load Engine
- **Approach**: Built with high-precision Web Worker fetch dispatching, bounded concurrency queues, and sliding-window reservoir sampling for exact quantile calculation.
- **Why**: Allows immediate, zero-friction local testing without requiring users to spin up external Kubernetes or cloud clusters, while generating real network traffic and real HTTP measurements.
- **Safety Safeguard**: Enforced limits (maximum 50 concurrent VUs, 120-second duration cap, and maximum 300 RPS per browser session) to prevent client resource starvation or unintentional DDoS.

### Decision 2: Preserving the Audited `project/` Backend Integration
- **Approach**: The audited `project/` backend from GitHub (`https://github.com/adityasinghr651/Lab_Engineering`) provides Express routes (`/health`, `/echo`, `/users/:id`, `/search`), JWT auth (`/auth/login`, `/auth/register`), and request logging middleware.
- **Integration**: The application includes a pre-configured target pointing directly to these routes, plus a simulated backend proxy adapter that handles live tests against both local and external API endpoints.

### Decision 3: Comprehensive Route & Navigation Architecture
- **Approach**: Multi-view single-page application router supporting public and authenticated sections:
  - *Public*: Home/Landing, Product Tour, Full Documentation (12 chapters), Community & Contributing, Authentication (Sign In, Register, Forgot Password), Legal (Privacy, Terms, Security).
  - *Authenticated App*: Dashboard Overview, Servers & Targets, Create Test Wizard, Live Monitoring, Test Runs History, Performance Bottleneck Analysis, Reports & Export, Run Comparisons, and System Settings.

### Decision 4: Deterministic Bottleneck Analysis Engine
- **Approach**: Evaluates 6 deterministic performance heuristics:
  1. *Throughput Saturation*: Request rate plateaus while latency increases exponentially.
  2. *Tail Latency Divergence*: p99 exceeds 4x the p50 baseline.
  3. *Error Cascade*: Burst of 5xx or connection resets at high concurrency.
  4. *Ramp-up Instability*: Cold start or initialization lag in early test seconds.
  5. *Slow Endpoint Pattern*: Mean latency exceeding configured SLO threshold.
  6. *Throughput Jitter*: High standard deviation in response latency.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                       DEVFLOW APP                                       │
│                                                                                         │
│  ┌───────────────────────┐  ┌────────────────────────────────────────────────────────┐  │
│  │   Navigation & Shell  │  │  Theme Manager (Light / Dark / System + LocalStorage)  │  │
│  └───────────┬───────────┘  └───────────────────────────┬────────────────────────────┘  │
│              │                                          │                               │
│              ▼                                          ▼                               │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                  VIEW ROUTER                                      │  │
│  │  Landing │ Docs │ Community │ Dashboard │ Targets │ Wizard │ Monitor │ Analysis │ Reports │  │
│  └──────────────────────────────────────────┬────────────────────────────────────────┘  │
│                                             │                                           │
│                     ┌───────────────────────┴───────────────────────┐                   │
│                     ▼                                               ▼                   │
│        ┌─────────────────────────┐                     ┌─────────────────────────┐      │
│        │   Test Target Store     │                     │     Test Run Store      │      │
│        │  (LocalStorage / Seed)  │                     │  (Run History & Baselines)│    │
│        └────────────┬────────────┘                     └────────────┬────────────┘      │
│                     │                                               │                   │
│                     └───────────────────────┬───────────────────────┘                   │
│                                             ▼                                           │
│                        ┌──────────────────────────────────────────┐                     │
│                        │       LOAD GENERATION & TELEMETRY        │                     │
│                        │  • Concurrency Worker Pool               │                     │
│                        │  • High-Resolution Stopwatch             │                     │
│                        │  • Percentile Reservoir (p50/95/99)      │                     │
│                        │  • Status Code Counter (2xx/4xx/5xx)     │                     │
│                        └────────────────────┬─────────────────────┘                     │
│                                             │                                           │
│                     ┌───────────────────────┴───────────────────────┐                   │
│                     ▼                                               ▼                   │
│        ┌─────────────────────────┐                     ┌─────────────────────────┐      │
│        │   DevFlow Local Target  │                     │   Public Microservices  │      │
│        │  (/health, /echo, etc.) │                     │ (JSONPlaceholder, etc.) │      │
│        └─────────────────────────┘                     └─────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Core Types

```typescript
export type TargetEnvironment = 'development' | 'staging' | 'production';

export interface TestTarget {
  id: string;
  name: string;
  baseUrl: string;
  environment: TargetEnvironment;
  healthEndpoint?: string;
  isVerified: boolean;
  createdAt: string;
  lastTestedAt?: string;
  defaultHeaders?: Record<string, string>;
  authConfig?: {
    type: 'none' | 'bearer' | 'basic' | 'apiKey';
    token?: string;
    headerName?: string;
  };
  limits: {
    maxRps: number;
    maxConcurrency: number;
    maxDurationSeconds: number;
  };
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

export interface BottleneckFinding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  evidence: string;
  metric: string;
  timeRange: string;
  explanation: string;
  recommendation: string;
  confidence: number; // 0-100%
}

export interface TestRun {
  id: string;
  name: string;
  targetId: string;
  targetName: string;
  targetUrl: string;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'cancelled' | 'failed';
  profile: WorkloadProfile;
  startedAt: string;
  finishedAt?: string;
  summary: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    avgRps: number;
    peakRps: number;
    p50LatencyMs: number;
    p95LatencyMs: number;
    p99LatencyMs: number;
    minLatencyMs: number;
    maxLatencyMs: number;
    errorRatePercent: number;
    statusCodes: Record<string, number>;
  };
  telemetry: TelemetryPoint[];
  findings: BottleneckFinding[];
}
```

---

## 5. Implementation Roadmap & Milestones

1. **Design Tokens & Theme Foundation**:
   - Establish CSS variables for light and dark palettes in `src/index.css`.
   - Setup `ThemeProvider` with system preference detection and `localStorage` persistence.
   - Configure typography with monospace tabular figure styling for telemetry.

2. **Core Domain Stores & Load Engine**:
   - Build `src/services/loadEngine.ts` with real `fetch` concurrency, timestamp delta measuring, quantile calculations, and live stream updates.
   - Seed pre-configured targets (`DevFlow Local Core`, `JSONPlaceholder`, `HTTPBin`).
   - Create local persistence layer for targets, test configs, and historical run data.

3. **Public Experience & Navigation**:
   - Modern, high-density Header with brand badge, theme toggle, and public/app view routing.
   - Engineering-focused Landing Page with live interactive metrics sandbox.
   - Complete 12-chapter Documentation portal with code blocks and API references.
   - Community & Contributing Hub with good-first-issues and architecture roadmap.
   - Authentication Views (Sign In, Sign Up, Forgot Password) with form validation.
   - Legal & Error Pages (Privacy, Terms, Security, 404, 500).

4. **Application Shell & Operational Dashboard**:
   - Responsive Collapsible Sidebar with route badges and status indicators.
   - Overview Dashboard with summary cards (Total Tests, Avg Throughput, P95 Trend, Active Targets, Error Rate), quick actions, and Getting Started onboarding guide.
   - Servers & Targets Management: Add target modal, health check pinger, SSRF safety guards, and environment filtering.

5. **Create Test Wizard (5 Steps)**:
   - Target selection & pre-flight health check.
   - Test pattern selection (Load, Stress, Spike, Soak).
   - Workload parameters (VUs, duration, ramp-up, headers, SLO thresholds).
   - Safety Review modal with risk assessment and explicit confirmation.
   - Review and Launch sequence.

6. **Live Telemetry & Cockpit**:
   - Real-time gauge metrics (VUs, RPS, p95, Error Rate).
   - Dynamic SVG latency percentiles chart (p50, p90, p95, p99 curves).
   - Live throughput and status code breakdown (2xx, 4xx, 5xx).
   - Interactive Run Controls: Abort, pause, and real-time event log.

7. **Performance Diagnostics, Reports & Comparisons**:
   - Automated Bottleneck Analyzer detecting throughput plateaus, latency spikes, and error cascades.
   - Side-by-side Test Run Comparison tool with delta computations ($\Delta$ RPS, $\Delta$ latency, $\Delta$ errors).
   - Clean printable report layout with JSON and Markdown export options.
   - Account and System Settings with concurrency clamps and retention policies.

8. **Verification & Testing**:
   - Compile validation via `compile_applet`.
   - Contrast and layout verification in both Light and Dark themes across desktop and mobile viewports.
