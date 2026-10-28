import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { NavigationRoute } from '../../types';

export const LegalView: React.FC<{ onNavigate: (route: NavigationRoute) => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'charter' | 'terms' | 'privacy' | 'security'>('charter');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-100/70 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-mono font-medium mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
          <span>Governance & Safety</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Responsible Testing & Platform Policies
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          DevFlow is an open-source engineering diagnostic platform. We mandate authorized testing and provide built-in safeguards against unintended denial of service.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('charter')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'charter'
              ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Responsible Testing Charter
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'terms'
              ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Terms of Use
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'privacy'
              ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Privacy & Storage Policy
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'security'
              ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Security & SSRF Mitigation
        </button>
      </div>

      {/* Content */}
      <Card className="p-6 sm:p-8 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {activeTab === 'charter' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Ethical & Authorized Testing Principles</span>
            </h2>
            <p>
              Load testing generates concentrated network traffic and server computational load. DevFlow is built strictly for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm pl-2">
              <li>Services, servers, and APIs owned and operated directly by you.</li>
              <li>Environments where you have explicit written authorization to conduct capacity assessments.</li>
              <li>Isolated staging, preview, and local development environments.</li>
            </ul>
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 space-y-1">
              <strong>Strict Prohibition:</strong> Do not generate traffic against third-party public services, shared infrastructure, or unauthorized targets. Users are personally responsible for verifying target authorization.
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Open-Source License & Terms</h2>
            <p className="text-xs sm:text-sm">
              DevFlow is provided as open-source software under the ISC / MIT license terms. The software is provided &ldquo;as is&rdquo;, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability or fitness for a particular purpose.
            </p>
            <p className="text-xs sm:text-sm">
              In no event shall the authors or copyright holders be liable for any claim, damages, server outages, cloud egress costs, or other liability arising from the use of this software.
            </p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Local-First Data Privacy</h2>
            <p className="text-xs sm:text-sm">
              DevFlow takes privacy seriously. By default:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm pl-2">
              <li>Target URLs, authorization tokens, and test results are stored locally in your browser storage.</li>
              <li>No telemetry, API keys, or target metrics are transmitted to any central tracking server.</li>
              <li>You can purge all target profiles and historical run data at any time from the Settings tab.</li>
            </ul>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">SSRF & Network Safeguards</h2>
            <p className="text-xs sm:text-sm">
              To mitigate Server-Side Request Forgery (SSRF) and runaway traffic loops:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm pl-2">
              <li>In-app testing executes via client fetch with browser sandbox security restrictions.</li>
              <li>Pre-flight headers prevent unauthorized header injection.</li>
              <li>Instant abort controls issue immediate AbortController signals to sever active HTTP connections.</li>
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
};
