import React, { useState, useMemo } from 'react';

type UnitSystem = 'metric' | 'imperial';

export const BMICalculator: React.FC = () => {
    const [units, setUnits] = useState<UnitSystem>('metric');
    const [height, setHeight] = useState<string>('');
    const [weight, setWeight] = useState<string>('');

    const bmiResult = useMemo(() => {
        const h = parseFloat(height);
        const w = parseFloat(weight);

        if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
            return null;
        }

        let bmi = 0;
        if (units === 'metric') {
            // weight in kg, height in cm
            bmi = w / ((h / 100) ** 2);
        } else {
            // weight in lbs, height in inches
            bmi = (w / (h ** 2)) * 703;
        }

        let category = '';
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal weight';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obese';

        return {
            value: bmi.toFixed(1),
            category,
        };
    }, [height, weight, units]);
    
    const heightUnit = units === 'metric' ? 'cm' : 'in';
    const weightUnit = units === 'metric' ? 'kg' : 'lbs';

    return (
        <div>
            <header className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-slate-100">BMI Calculator</h2>
                <p className="text-slate-400">Check your Body Mass Index</p>
            </header>

            <div className="max-w-md mx-auto">
                <div className="bg-slate-900/60 rounded-lg p-1 flex justify-center space-x-1 mb-6">
                    <button onClick={() => setUnits('metric')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${units === 'metric' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-700/50'}`}>Metric</button>
                    <button onClick={() => setUnits('imperial')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${units === 'imperial' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-700/50'}`}>Imperial</button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-slate-400 text-sm font-medium">Height ({heightUnit})</label>
                        <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="0" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-400 text-sm font-medium">Weight ({weightUnit})</label>
                        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="0" />
                    </div>
                </div>

                {bmiResult && (
                    <div className="mt-8 text-center bg-slate-900/70 p-6 rounded-lg border border-slate-700">
                        <p className="text-lg text-slate-300">Your BMI is</p>
                        <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 my-2">{bmiResult.value}</p>
                        <p className="font-semibold text-lg" style={{ color: bmiResult.category === 'Normal weight' ? '#2dd4bf' : '#fb923c' }}>{bmiResult.category}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
