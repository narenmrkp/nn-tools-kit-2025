import React, { useState, useCallback } from 'react';

interface Weights {
  g: string;
  kg: string;
  lb: string;
  oz: string;
  st: string;
}

const WeightInput: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-slate-400 text-sm font-medium">{label}</label>
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
      placeholder="0.0"
    />
  </div>
);

export const WeightConverter: React.FC = () => {
  const [weights, setWeights] = useState<Weights>({ g: '', kg: '', lb: '', oz: '', st: '' });

  const handleWeightChange = useCallback((value: string, unit: keyof Weights) => {
    const numValue = parseFloat(value);
    if (value === '') {
      setWeights({ g: '', kg: '', lb: '', oz: '', st: '' });
      return;
    }
    if (isNaN(numValue)) {
       setWeights(prev => ({ ...prev, [unit]: value }));
       return;
    }

    let kg = 0;
    switch (unit) {
      case 'g': kg = numValue / 1000; break;
      case 'kg': kg = numValue; break;
      case 'lb': kg = numValue / 2.20462; break;
      case 'oz': kg = numValue / 35.274; break;
      case 'st': kg = numValue * 6.35029; break;
    }

    setWeights({
      g: (kg * 1000).toFixed(3),
      kg: kg.toFixed(3),
      lb: (kg * 2.20462).toFixed(3),
      oz: (kg * 35.274).toFixed(3),
      st: (kg / 6.35029).toFixed(3),
    });
  }, []);

  return (
    <div>
        <header className="flex items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100">Weight Converter</h2>
            <p className="text-slate-400">Convert between different weight units</p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <WeightInput label="Grams (g)" value={weights.g} onChange={(v) => handleWeightChange(v, 'g')} />
            <WeightInput label="Kilograms (kg)" value={weights.kg} onChange={(v) => handleWeightChange(v, 'kg')} />
            <WeightInput label="Pounds (lb)" value={weights.lb} onChange={(v) => handleWeightChange(v, 'lb')} />
            <WeightInput label="Ounces (oz)" value={weights.oz} onChange={(v) => handleWeightChange(v, 'oz')} />
            <WeightInput label="Stones (st)" value={weights.st} onChange={(v) => handleWeightChange(v, 'st')} />
        </div>

        <div className="mt-6 text-center bg-slate-900/70 p-4 rounded-lg border border-slate-700">
            <p className="text-lg text-slate-300">Quick Tip</p>
            <p className="text-slate-400 text-sm">Enter a value in any field to see instant conversions across all units.</p>
        </div>
    </div>
  );
};