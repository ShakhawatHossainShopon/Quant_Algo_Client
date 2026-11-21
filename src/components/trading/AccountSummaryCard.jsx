import React from 'react';
import { DollarSign, Activity, TrendingUp, Shield, Server, RefreshCw } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function AccountSummaryCard({ account, loading, onRefresh, error }) {
  if (error) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-900 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-amber-950">MT5 Terminal Offline / Not Connected</h3>
              <p className="text-xs text-amber-700 mt-0.5">{error}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" icon={RefreshCw} loading={loading} onClick={onRefresh}>
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  const isProfitPositive = (account?.profit || 0) >= 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600 shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">MT5 Trading Account</h2>
              <Badge variant={account?.trade_mode === 'Real' ? 'success' : 'primary'}>
                {account?.trade_mode || 'Demo'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Login: #{account?.login || '---'} | Server: {account?.server || '---'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Connected
          </div>
          <Button variant="secondary" size="sm" icon={RefreshCw} loading={loading} onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Balance */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Balance
          </span>
          <span className="text-xl font-bold font-mono text-slate-900">
            ${account ? Number(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
          </span>
        </div>

        {/* Equity */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Equity
          </span>
          <span className="text-xl font-bold font-mono text-slate-900">
            ${account ? Number(account.equity).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
          </span>
        </div>

        {/* Floating Profit */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Floating P/L
          </span>
          <span className={`text-xl font-bold font-mono ${isProfitPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isProfitPositive ? '+' : ''}${account ? Number(account.profit).toFixed(2) : '0.00'}
          </span>
        </div>

        {/* Margin Level */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Margin Level
          </span>
          <span className="text-xl font-bold font-mono text-slate-900">
            {account?.margin_level ? `${account.margin_level}%` : '---'}
          </span>
        </div>
      </div>

      {/* Sub Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100 font-mono">
        <div>Margin Used: <strong>${account?.margin || '0.00'}</strong></div>
        <div>Free Margin: <strong>${account?.margin_free || '0.00'}</strong></div>
        <div>Leverage: <strong>1:{account?.leverage || '100'}</strong></div>
        <div>Currency: <strong>{account?.currency || 'USD'}</strong></div>
      </div>
    </div>
  );
}
