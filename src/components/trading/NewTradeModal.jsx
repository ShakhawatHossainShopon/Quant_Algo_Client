import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useApi } from '../../hooks/useApi';
import { 
  TrendingUp, TrendingDown, Search, Layers, 
  ChevronDown, Edit3, CheckCircle2 
} from 'lucide-react';

export function NewTradeModal({ isOpen, onClose, onSuccess }) {
  const { get, post, loading, error: apiError } = useApi();

  const [symbolsList, setSymbolsList] = useState([]);
  const [symbolsLoading, setSymbolsLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('EURUSD');
  const [customSymbol, setCustomSymbol] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const [action, setAction] = useState('BUY'); // 'BUY' or 'SELL'
  const [volume, setVolume] = useState('0.01');
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const [comment, setComment] = useState('QuantAlgo Web');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch available symbols from backend when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchSymbols = async () => {
      setSymbolsLoading(true);
      try {
        const res = await get('/api/mt5/symbols');
        if (isMounted && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setSymbolsList(res.data);
          // Default to first symbol if current selected is not in list
          const exists = res.data.some(s => s.symbol === selectedAsset);
          if (!exists) {
            setSelectedAsset(res.data[0].symbol);
          }
        }
      } catch (err) {
        console.error('Failed to load symbols from API, using defaults:', err);
      } finally {
        if (isMounted) setSymbolsLoading(false);
      }
    };

    fetchSymbols();
    return () => { isMounted = false; };
  }, [isOpen, get]);

  // Default fallback assets if API takes time or is offline
  const fallbackSymbols = [
    { symbol: 'EURUSD', category: 'Forex Majors', description: 'Euro vs US Dollar' },
    { symbol: 'GBPUSD', category: 'Forex Majors', description: 'British Pound vs US Dollar' },
    { symbol: 'USDJPY', category: 'Forex Majors', description: 'US Dollar vs Japanese Yen' },
    { symbol: 'AUDUSD', category: 'Forex Majors', description: 'Australian Dollar vs US Dollar' },
    { symbol: 'USDCAD', category: 'Forex Majors', description: 'US Dollar vs Canadian Dollar' },
    { symbol: 'USDCHF', category: 'Forex Majors', description: 'US Dollar vs Swiss Franc' },
    { symbol: 'XAUUSD', category: 'Metals & Energy', description: 'Gold vs US Dollar' },
    { symbol: 'XAGUSD', category: 'Metals & Energy', description: 'Silver vs US Dollar' },
    { symbol: 'BTCUSD', category: 'Crypto', description: 'Bitcoin vs US Dollar' },
    { symbol: 'ETHUSD', category: 'Crypto', description: 'Ethereum vs US Dollar' }
  ];

  const activeSymbols = symbolsList.length > 0 ? symbolsList : fallbackSymbols;

  const filteredSymbols = activeSymbols.filter(s => 
    s.symbol.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const effectiveSymbol = isCustomMode ? customSymbol.trim().toUpperCase() : selectedAsset;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!effectiveSymbol) {
      setErrorMsg('Please select or specify a trading asset / symbol.');
      return;
    }

    const vol = parseFloat(volume);
    if (isNaN(vol) || vol <= 0) {
      setErrorMsg('Volume (Lots) must be greater than 0.');
      return;
    }

    try {
      const payload = {
        symbol: effectiveSymbol,
        action: action.toUpperCase(),
        volume: vol,
        sl: sl ? parseFloat(sl) : 0.0,
        tp: tp ? parseFloat(tp) : 0.0,
        comment: comment.trim() || 'QuantAlgo Web'
      };

      const res = await post('/api/mt5/position/create', payload);

      if (res.success) {
        if (onSuccess) {
          onSuccess(res.message || `Position ${action} ${vol} ${effectiveSymbol} opened successfully!`);
        }
        onClose();
      } else {
        setErrorMsg(res.message || 'Failed to open position.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error executing trade request.');
    }
  };

  const handleAssetSelectChange = (e) => {
    const val = e.target.value;
    if (val === '__CUSTOM__') {
      setIsCustomMode(true);
      if (!customSymbol) setCustomSymbol(selectedAsset);
    } else {
      setIsCustomMode(false);
      setSelectedAsset(val);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Open Market Position" maxWidth="max-w-lg">
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

        {/* ASSET SELECTION SECTION */}
        <div className="space-y-2 bg-slate-50/80 border border-slate-200/80 p-3.5 rounded-xl">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-800">
              Select Trading Asset
            </label>
            <button
              type="button"
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              {isCustomMode ? 'Use Dropdown List' : 'Type Custom Symbol'}
            </button>
          </div>

          {!isCustomMode ? (
            <div className="space-y-2">
              {/* Filter search if list is large */}
              {activeSymbols.length > 8 && (
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter assets (e.g. EUR, XAU, BTC, Gold)..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  />
                </div>
              )}

              {/* Native Dropdown */}
              <div className="relative">
                <select
                  value={selectedAsset}
                  onChange={handleAssetSelectChange}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 cursor-pointer"
                >
                  {filteredSymbols.map((s) => (
                    <option key={s.symbol} value={s.symbol}>
                      {s.symbol} {s.description && s.description !== s.symbol ? `— ${s.description}` : ''}
                    </option>
                  ))}
                  <option value="__CUSTOM__">✍️ + Enter Custom Symbol...</option>
                </select>
              </div>

              {/* Quick Picks Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 font-medium">Quick Picks:</span>
                {activeSymbols.slice(0, 5).map((s) => (
                  <button
                    key={s.symbol}
                    type="button"
                    onClick={() => {
                      setSelectedAsset(s.symbol);
                      setIsCustomMode(false);
                    }}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                      selectedAsset === s.symbol && !isCustomMode
                        ? 'bg-teal-50 border-teal-300 text-teal-700 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {s.symbol}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Input
                placeholder="Enter exact broker symbol (e.g. EURUSD, EURUSDm, GOLD)"
                value={customSymbol}
                onChange={(e) => setCustomSymbol(e.target.value.toUpperCase())}
                required
                autoFocus
              />
              <p className="text-[11px] text-slate-500">
                Type the exact symbol name as recognized by your MetaTrader 5 broker.
              </p>
            </div>
          )}
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
            Confirm {action} {volume || '0.01'} Lots {effectiveSymbol ? `(${effectiveSymbol})` : ''}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
