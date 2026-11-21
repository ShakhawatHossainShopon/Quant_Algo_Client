import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useApi } from '../../hooks/useApi';
import { TrendingUp, TrendingDown, DollarSign, Target, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export function NewTradeModal({ isOpen, onClose, onSuccess }) {
  const { post, loading, error: apiError } = useApi();

  const [symbol, setSymbol] = useState('EURUSD');
  const [action, setAction] = useState('BUY'); // 'BUY' or 'SELL'
  const [volume, setVolume] = useState('0.01');
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const [comment, setComment] = useState('QuantAlgo Web');
  const [errorMsg, setErrorMsg] = useState('');

  const quickSymbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'BTCUSD'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!symbol.trim()) {
      setErrorMsg('Please specify a trading symbol (e.g., EURUSD).');
      return;
    }

    const vol = parseFloat(volume);
    if (isNaN(vol) || vol <= 0) {
      setErrorMsg('Volume (Lots) must be greater than 0.');
      return;
    }

    try {
      const payload = {
        symbol: symbol.trim().toUpperCase(),
        action: action.toUpperCase(),
        volume: vol,
        sl: sl ? parseFloat(sl) : 0.0,
        tp: tp ? parseFloat(tp) : 0.0,
        comment: comment.trim() || 'QuantAlgo Web'
      };

      const res = await post('/api/mt5/position/create', payload);

      if (res.success) {
        if (onSuccess) {
          onSuccess(res.message || `Position ${action} ${vol} ${symbol} opened successfully!`);
        }
        onClose();
      } else {
        setErrorMsg(res.message || 'Failed to open position.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error executing trade request.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Open New Market Position" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error Alert */}
        {(errorMsg || apiError) && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
            {errorMsg || apiError}
          </div>
        )}

        {/* Action Selector: BUY / SELL */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">Order Action</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAction('BUY')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm border-2 transition-all cursor-pointer ${
                action === 'BUY'
                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              BUY (Long)
            </button>
            <button
              type="button"
              onClick={() => setAction('SELL')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm border-2 transition-all cursor-pointer ${
                action === 'SELL'
                  ? 'bg-rose-500 border-rose-600 text-white shadow-md shadow-rose-500/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-700'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              SELL (Short)
            </button>
          </div>
        </div>

        {/* Symbol with Quick Picks */}
        <div className="space-y-2">
          <Input
            label="Symbol (Instrument)"
            placeholder="e.g. EURUSD, XAUUSD"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            required
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Quick Select:</span>
            {quickSymbols.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSymbol(s)}
                className={`text-[11px] font-mono px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                  symbol === s
                    ? 'bg-teal-50 border-teal-300 text-teal-700 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Volume (Lots) */}
        <Input
          label="Volume (Lots)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.01"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          required
        />

        {/* SL & TP Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Stop Loss (SL Price)"
            type="number"
            step="any"
            placeholder="0.00000 (optional)"
            value={sl}
            onChange={(e) => setSl(e.target.value)}
          />
          <Input
            label="Take Profit (TP Price)"
            type="number"
            step="any"
            placeholder="0.00000 (optional)"
            value={tp}
            onChange={(e) => setTp(e.target.value)}
          />
        </div>

        {/* Order Comment */}
        <Input
          label="Order Comment"
          placeholder="QuantAlgo Web"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={action === 'BUY' ? 'primary' : 'danger'}
            loading={loading}
          >
            Confirm {action} {volume || '0.01'} Lots
          </Button>
        </div>
      </form>
    </Modal>
  );
}
