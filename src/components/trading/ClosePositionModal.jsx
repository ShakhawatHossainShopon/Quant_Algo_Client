import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

export function ClosePositionModal({ isOpen, onClose, position, onConfirm, loading }) {
  if (!position) return null;

  const isProfit = (position.profit || 0) >= 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Close Position Confirmation" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200/80 p-3.5 rounded-xl text-amber-900 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Are you sure you want to close this position?</p>
            <p className="text-amber-700 mt-0.5">This will immediately send a market close order to MetaTrader 5.</p>
          </div>
        </div>

        {/* Position Details Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Ticket</span>
            <span className="font-mono font-bold text-slate-800">#{position.ticket}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Symbol & Direction</span>
            <span className="font-bold flex items-center gap-1.5 font-mono">
              {position.symbol}
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                position.type === 'BUY' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {position.type}
              </span>
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Volume</span>
            <span className="font-mono font-semibold">{Number(position.volume).toFixed(2)} Lots</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Open Price</span>
            <span className="font-mono">{Number(position.price_open).toFixed(5)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Current Price</span>
            <span className="font-mono font-semibold">{Number(position.price_current).toFixed(5)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
            <span className="text-slate-700 font-semibold">Estimated P/L</span>
            <span className={`font-mono font-bold text-sm ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isProfit ? '+' : ''}${Number(position.profit).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={loading}
            onClick={() => onConfirm(position.ticket)}
          >
            Confirm & Close Trade
          </Button>
        </div>
      </div>
    </Modal>
  );
}
