import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { XCircle, TrendingUp, TrendingDown, Layers } from 'lucide-react';

export function OpenPositionsTable({ positions = [], loading, onClosePosition, onOpenNewTrade }) {
  const safePositions = positions || [];
  const totalVolume = safePositions.reduce((acc, p) => acc + (p.volume || 0), 0);
  const totalProfit = safePositions.reduce((acc, p) => acc + (p.profit || 0), 0);
  const isNetProfitPositive = totalProfit >= 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Table Header / Summary */}
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-teal-600" />
          <div>
            <h3 className="font-bold text-sm text-slate-900">Running Positions</h3>
            <p className="text-xs text-slate-500">Active market orders currently open in MT5</p>
          </div>
        </div>

        {safePositions.length > 0 && (
          <div className="flex items-center gap-3 text-xs font-mono self-end sm:self-auto">
            <span className="text-slate-500">Total Lots: <strong>{totalVolume.toFixed(2)}</strong></span>
            <span className="text-slate-300">|</span>
            <span>
              Net P/L:{' '}
              <strong className={isNetProfitPositive ? 'text-emerald-600' : 'text-rose-600'}>
                {isNetProfitPositive ? '+' : ''}${totalProfit.toFixed(2)}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-mono text-[11px]">
            <tr>
              <th className="py-3 px-4">Ticket</th>
              <th className="py-3 px-4">Symbol</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Volume</th>
              <th className="py-3 px-4">Open Price</th>
              <th className="py-3 px-4">Current Price</th>
              <th className="py-3 px-4">Floating P/L</th>
              <th className="py-3 px-4">Open Time</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {safePositions.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Layers className="w-4 h-4" />
                    </span>
                    <span className="text-xs text-slate-500">No open positions currently running.</span>
                    {onOpenNewTrade && (
                      <button
                        onClick={onOpenNewTrade}
                        className="mt-2 text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
                      >
                        + Create a new trade position
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              safePositions.map((pos) => {
                const isPosProfit = pos.profit >= 0;
                return (
                  <tr key={pos.ticket} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-500">
                      #{pos.ticket}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      {pos.symbol}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        pos.type === 'BUY' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {pos.type === 'BUY' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {pos.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {Number(pos.volume).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {Number(pos.price_open).toFixed(5)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-800 font-semibold">
                      {Number(pos.price_current).toFixed(5)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-sm">
                      <span className={isPosProfit ? 'text-emerald-600' : 'text-rose-600'}>
                        {isPosProfit ? '+' : ''}${Number(pos.profit).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {pos.open_time}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="danger"
                        size="sm"
                        icon={XCircle}
                        onClick={() => onClosePosition(pos)}
                        disabled={loading}
                      >
                        Close
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
