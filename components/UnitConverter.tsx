import React, { useState, useMemo } from 'react';

const units = {
  Length: {
    Meter: 1,
    Kilometer: 1000,
    Mile: 1609.34,
    Foot: 0.3048,
    Inch: 0.0254,
    Yard: 0.9144,
  },
  Mass: {
    Gram: 1,
    Kilogram: 1000,
    Pound: 453.592,
    Ounce: 28.3495,
  },
  Volume: {
    Liter: 1,
    Milliliter: 0.001,
    'Cubic Meter': 1000,
    'Gallon (US)': 3.78541,
    'Quart (US)': 0.946353,
  },
  Temperature: {
    Celsius: { toBase: (c: number) => c, fromBase: (c: number) => c },
    Fahrenheit: { toBase: (f: number) => (f - 32) * 5/9, fromBase: (c: number) => (c * 9/5) + 32 },
    Kelvin: { toBase: (k: number) => k - 273.15, fromBase: (c: number) => c + 273.15 },
  },
  Data: {
    Bit: 1,
    Byte: 8,
    Kilobyte: 8 * 1024,
    Megabyte: 8 * 1024 * 1024,
    Gigabyte: 8 * 1024 * 1024 * 1024,
  },
};

type UnitCategory = keyof typeof units;

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('Length');
  const [fromUnit, setFromUnit] = useState<string>('Meter');
  const [toUnit, setToUnit] = useState<string>('Kilometer');
  const [inputValue, setInputValue] = useState<string>('1');

  const unitOptions = Object.keys(units[category]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as UnitCategory;
    setCategory(newCategory);
    const newUnitOptions = Object.keys(units[newCategory]);
    setFromUnit(newUnitOptions[0]);
    setToUnit(newUnitOptions[1] || newUnitOptions[0]);
  };
  
  const outputValue = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';

    const categoryData = units[category];

    let baseValue;
    if (category === 'Temperature') {
        baseValue = (categoryData[fromUnit as keyof typeof categoryData] as any).toBase(value);
    } else {
        baseValue = value * (categoryData[fromUnit as keyof typeof categoryData] as number);
    }

    let result;
    if (category === 'Temperature') {
        result = (categoryData[toUnit as keyof typeof categoryData] as any).fromBase(baseValue);
    } else {
        result = baseValue / (categoryData[toUnit as keyof typeof categoryData] as number);
    }

    return result.toLocaleString(undefined, { maximumFractionDigits: 5 });
  }, [inputValue, fromUnit, toUnit, category]);

  return (
    <div>
      <header className="flex items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-100">Universal Unit Converter</h2>
          <p className="text-slate-400">Convert between various types of units</p>
        </div>
      </header>
      
      <div className="flex flex-col gap-4 max-w-lg mx-auto">
        <div>
          <label className="text-slate-400 text-sm font-medium">Category</label>
          <select value={category} onChange={handleCategoryChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 mt-1">
            {Object.keys(units).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-end gap-2">
            <div className="flex flex-col gap-1">
                <label className="text-slate-400 text-sm font-medium">From</label>
                <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3">
                    {unitOptions.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                </select>
            </div>
            <div className="text-2xl font-bold text-slate-500 pb-3">=</div>
            <div className="flex flex-col gap-1">
                 <label className="text-slate-400 text-sm font-medium">To</label>
                <select value={toUnit} onChange={e => setToUnit(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3">
                     {unitOptions.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                </select>
            </div>
        </div>
        
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-slate-400 text-sm font-medium">{fromUnit}</label>
                <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 mt-1 font-mono text-lg" />
              </div>
              <div>
                 <label className="text-slate-400 text-sm font-medium">{toUnit}</label>
                 <input type="text" value={outputValue} readOnly className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 mt-1 font-mono text-lg" />
              </div>
        </div>
      </div>
    </div>
  );
};
