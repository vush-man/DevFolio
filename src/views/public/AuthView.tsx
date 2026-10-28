import React, { useState } from 'react';
import {
  Activity,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { NavigationRoute } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const AuthView: React.FC<{ onNavigate: (route: NavigationRoute) => void }> = ({ onNavigate }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [name, setName] = useState('Alex Rivers');
  const [email, setEmail] = useState('alex.rivers@performance.lab');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!email || !email.includes('@')) {
      setError('Please provide a valid engineering email address.');
      setIsSubmitting(false);
      return;
    }

    if (mode === 'forgot') {
      setTimeout(() => {
        setResetSent(true);
        setIsSubmitting(false);
      }, 600);
      return;
    }

    if (mode === 'signup' && (!name || name.trim().length < 2)) {
      setError('Please provide your full name (at least 2 characters).');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (mode === 'signin') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-sky-600 dark:bg-sky-500 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Activity className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight font-mono">
            {mode === 'signin' && 'Sign In to DevFlow'}
            {mode === 'signup' && 'Create Developer Account'}
            {mode === 'forgot' && 'Reset Access Password'}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Open-source server performance engineering & testing platform
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {resetSent && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Password reset instructions dispatched to your email address.</span>
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Alex Rivers"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="engineer@company.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); setError(null); }}
                        className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="w-full text-xs font-mono py-2.5 mt-2"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                {mode === 'signin' && 'Sign In to Workspace'}
                {mode === 'signup' && 'Create Free Account'}
                {mode === 'forgot' && 'Send Recovery Instructions'}
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
              {mode === 'signin' ? (
                <>
                  <span>New to DevFlow?</span>
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setError(null); }}
                    className="font-medium text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    Register new account &rarr;
                  </button>
                </>
              ) : (
                <>
                  <span>Already registered?</span>
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setError(null); setResetSent(false); }}
                    className="font-medium text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    Sign in to account &rarr;
                  </button>
                </>
              )}
            </CardFooter>
          </form>
        </Card>

        {/* Demo Credentials hint */}
        <div className="p-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-800 text-center text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          Demo Credentials: <span className="text-slate-700 dark:text-slate-300">alex.rivers@performance.lab</span> / <span className="text-slate-700 dark:text-slate-300">password123</span>
        </div>
      </div>
    </div>
  );
};
