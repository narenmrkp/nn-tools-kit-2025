import React, { useState, useCallback } from 'react';

interface Distances {
  m: string;
  km: string;
  mi: string;
  ft: string;
  inch: string;
  yd: string;
}

const DistanceInput: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
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

export const DistanceConverter: React.FC = () => {
  const [distances, setDistances] = useState<Distances>({ m: '', km: '', mi: '', ft: '', inch: '', yd: '' });

  const handleDistanceChange = useCallback((value: string, unit: keyof Distances) => {
    const numValue = parseFloat(value);
    if (value === '') {
      setDistances({ m: '', km: '', mi: '', ft: '', inch: '', yd: '' });
      return;
    }
    if (isNaN(numValue)) {
       setDistances(prev => ({ ...prev, [unit]: value }));
       return;
    }

    let meters = 0;
    switch (unit) {
      case 'm': meters = numValue; break;
      case 'km': meters = numValue * 1000; break;
      case 'mi': meters = numValue * 1609.34; break;
      case 'ft': meters = numValue / 3.28084; break;
      case 'inch': meters = numValue / 39.3701; break;
      case 'yd': meters = numValue / 1.09361; break;
    }

    setDistances({
      m: meters.toFixed(3),
      km: (meters / 1000).toFixed(3),
      mi: (meters / 1609.34).toFixed(3),
      ft: (meters * 3.28084).toFixed(3),
      inch: (meters * 39.3701).toFixed(3),
      yd: (meters * 1.09361).toFixed(3),
    });
  }, []);

  return (
    <div>
        <header className="flex items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100">Distance Converter</h2>
            <p className="text-slate-400">Convert various units of length</p>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <DistanceInput label="Meters (m)" value={distances.m} onChange={(v) => handleDistanceChange(v, 'm')} />
            <DistanceInput label="Kilometers (km)" value={distances.km} onChange={(v) => handleDistanceChange(v, 'km')} />
            <DistanceInput label="Miles (mi)" value={distances.mi} onChange={(v) => handleDistanceChange(v, 'mi')} />
            <DistanceInput label="Feet (ft)" value={distances.ft} onChange={(v) => handleDistanceChange(v, 'ft')} />
            <DistanceInput label="Inches (in)" value={distances.inch} onChange={(v) => handleDistanceChange(v, 'inch')} />
            <DistanceInput label="Yards (yd)" value={distances.yd} onChange={(v) => handleDistanceChange(v, 'yd')} />
        </div>
    </div>
  );
};