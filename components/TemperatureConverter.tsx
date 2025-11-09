import React, { useState, useCallback } from 'react';
import { ArrowRightIcon } from './Icons';

interface Temps {
  celsius: string;
  fahrenheit: string;
  kelvin: string;
}

const TemperatureInput: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
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


export const TemperatureConverter: React.FC = () => {
  const [temps, setTemps] = useState<Temps>({ celsius: '', fahrenheit: '', kelvin: '' });

  const handleTempChange = useCallback((value: string, unit: keyof Temps) => {
    const numValue = parseFloat(value);
    if (value === '') {
      setTemps({ celsius: '', fahrenheit: '', kelvin: '' });
      return;
    }
    if (isNaN(numValue)) {
       setTemps(prev => ({ ...prev, [unit]: value }));
       return;
    }

    let c = 0, f = 0, k = 0;

    switch (unit) {
      case 'celsius':
        c = numValue;
        f = (c * 9/5) + 32;
        k = c + 273.15;
        break;
      case 'fahrenheit':
        f = numValue;
        c = (f - 32) * 5/9;
        k = c + 273.15;
        break;
      case 'kelvin':
        k = numValue;
        c = k - 273.15;
        f = (c * 9/5) + 32;
        break;
    }

    setTemps({
      celsius: c.toFixed(2),
      fahrenheit: f.toFixed(2),
      kelvin: k.toFixed(2),
    });
  }, []);

  return (
    <div>
        <header className="flex items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100">Temperature Converter</h2>
            <p className="text-slate-400">Instantly convert temperature units</p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TemperatureInput label="Celsius (°C)" value={temps.celsius} onChange={(v) => handleTempChange(v, 'celsius')} />
            <TemperatureInput label="Fahrenheit (°F)" value={temps.fahrenheit} onChange={(v) => handleTempChange(v, 'fahrenheit')} />
            <TemperatureInput label="Kelvin (K)" value={temps.kelvin} onChange={(v) => handleTempChange(v, 'kelvin')} />
        </div>

        <div className="mt-6 text-center bg-slate-900/70 p-4 rounded-lg border border-slate-700">
            <p className="text-lg text-slate-300">Conversion Tip</p>
            <p className="text-slate-400 text-sm">Enter a value in any field to see the conversion in the other units instantly.</p>
        </div>
    </div>
  );
};
