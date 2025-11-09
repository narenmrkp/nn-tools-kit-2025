
import React from 'react';
import type { Currency } from '../types';

interface CurrencyInputProps {
  label: string;
  currencies: Currency[];
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  amount: string;
  onAmountChange: (value: string) => void;
  disabled?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  currencies,
  selectedCurrency,
  onCurrencyChange,
  amount,
  onAmountChange,
  disabled = false,
}) => {
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currency = currencies.find(c => c.code === e.target.value);
    if (currency) {
      onCurrencyChange(currency);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-slate-400 text-sm font-medium">{label}</label>
      <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-cyan-500 transition-shadow">
        <div className="relative">
          <select
            value={selectedCurrency.code}
            onChange={handleCurrencyChange}
            className="pl-10 pr-4 py-3 bg-transparent text-white font-semibold appearance-none focus:outline-none cursor-pointer"
          >
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code} className="bg-slate-800 text-white">
                {currency.code}
              </option>
            ))}
          </select>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
            {selectedCurrency.symbol}
          </span>
        </div>
        <div className="w-px h-6 bg-slate-700"></div>
        <input
          type="text"
          value={amount}
          onChange={e => onAmountChange(e.target.value)}
          disabled={disabled}
          className="w-full bg-transparent p-3 text-white text-right font-mono text-lg focus:outline-none disabled:opacity-75"
          placeholder="0.00"
        />
      </div>
    </div>
  );
};
   