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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-teal-50/20 to-indigo-50/30 relative">
      <div className="w-full max-w-md relative z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 p-0.5 shadow-lg shadow-teal-600/20 mb-4">
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-teal-600" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quant Algo Console</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to manage trading administrators</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
          {formError && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
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
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Default superadmin:</span>
            <button
              type="button"
              onClick={autofillDemo}
              className="text-teal-600 hover:text-teal-700 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              Autofill (admin / admin123)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
