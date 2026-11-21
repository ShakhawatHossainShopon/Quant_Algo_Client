import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Shield, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!username.trim() || !password.trim()) {
      setFormError('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password.trim());
    } catch (err) {
      setFormError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setFormError('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0a0e17] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-xl shadow-teal-500/20 mb-4">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-teal-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Quant Algo Console</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to manage algorithmic trading administrators</p>
        </div>

        {/* Card */}
        <div className="bg-[#111827]/90 border border-slate-800/90 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          {formError && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username or Email"
              type="text"
              placeholder="e.g. admin or admin@quantalgo.com"
              icon={User}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Sign In to Console
            </Button>
          </form>

          {/* Quick Demo Autofill helper */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Default superadmin:</span>
            <button
              type="button"
              onClick={autofillDemo}
              className="text-teal-400 hover:text-teal-300 font-semibold underline underline-offset-2 transition-colors"
            >
              Autofill (admin / admin123)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
