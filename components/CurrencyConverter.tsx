import React, { useState, useCallback, useMemo } from 'react';
import { CurrencyInput } from './CurrencyInput';
import { SwapButton } from './SwapButton';
import { ArrowRightIcon, CurrencyExchangeIcon, SourceIcon } from './Icons';
import { getConversion } from '../services/geminiService';
import { currencies } from '../constants';
import type { ConversionResult, Currency, GroundingSource } from '../types';

export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<Currency>(currencies.find(c => c.code === 'USD')!);
  const [toCurrency, setToCurrency] = useState<Currency>(currencies.find(c => c.code === 'INR')!);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSwapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
    setSources([]);
  }, [fromCurrency, toCurrency]);

  const handleConvert = useCallback(async () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setSources([]);

    try {
      const { result: conversionResult, sources: conversionSources } = await getConversion(numericAmount, fromCurrency.code, toCurrency.code);
      setResult(conversionResult);
      setSources(conversionSources);
    } catch (err) {
      setError('Failed to fetch conversion data. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [amount, fromCurrency, toCurrency]);

  const convertedAmount = useMemo(() => {
    if (!result) return '...';
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(result.convertedAmount);
  }, [result]);

  return (
    <div>
        <header className="flex items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100">Currency Converter</h2>
            <p className="text-slate-400">Real-time exchange rates powered by AI</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-2">
          <CurrencyInput
            label="Amount"
            currencies={currencies}
            selectedCurrency={fromCurrency}
            onCurrencyChange={setFromCurrency}
            amount={amount}
            onAmountChange={setAmount}
          />

          <div className="flex justify-center my-2 md:my-0">
            <SwapButton onClick={handleSwapCurrencies} />
          </div>

          <CurrencyInput
            label="Converted To"
            currencies={currencies}
            selectedCurrency={toCurrency}
            onCurrencyChange={setToCurrency}
            amount={isLoading ? 'Calculating...' : convertedAmount}
            onAmountChange={() => {}}
            disabled={true}
          />
        </div>
        
        {error && <div className="mt-6 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}

        {result && !isLoading && (
          <div className="mt-6 text-center bg-slate-900/70 p-4 rounded-lg border border-slate-700">
            <p className="text-lg text-slate-300">Indicative Rate</p>
            <p className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              1 {fromCurrency.code} = {result.rate.toFixed(4)} {toCurrency.code}
            </p>
            {sources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
                  <SourceIcon className="w-4 h-4" />
                  Data sourced from:
                </p>
                <ul className="text-xs text-slate-500 mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
                  {sources.map((source, index) => (
                    <li key={index}>
                      <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                        {new URL(source.uri).hostname}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleConvert}
          disabled={isLoading}
          className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-bold text-lg py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Converting...
            </>
          ) : (
            <>
              Convert <ArrowRightIcon className="w-5 h-5" />
            </>
          )}
        </button>
    </div>
  );
};
