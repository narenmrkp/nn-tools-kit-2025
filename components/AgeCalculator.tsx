import React, { useState, useMemo } from 'react';

interface Age {
    years: number;
    months: number;
    days: number;
}

export const AgeCalculator: React.FC = () => {
    const [birthDate, setBirthDate] = useState<string>('');

    const calculateAge = (dateString: string): Age | null => {
        if (!dateString) return null;

        const birthDate = new Date(dateString);
        if (isNaN(birthDate.getTime())) return null;

        const today = new Date();
        
        if (birthDate > today) return { years: 0, months: 0, days: 0 };

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        return { years, months, days };
    };
    
    const age = useMemo(() => calculateAge(birthDate), [birthDate]);

    return (
        <div>
            <header className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-slate-100">Age Calculator</h2>
                <p className="text-slate-400">Find out your exact age</p>
            </header>

            <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <label htmlFor="birthdate" className="text-slate-400 text-sm font-medium">Enter Your Date of Birth</label>
                <input
                    type="date"
                    id="birthdate"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow [color-scheme:dark]"
                />
            </div>
            
            {age && birthDate && (
                 <div className="mt-8 text-center bg-slate-900/70 p-6 rounded-lg border border-slate-700 max-w-md mx-auto">
                    <p className="text-lg text-slate-300 mb-4">You are</p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">{age.years}</p>
                            <p className="text-sm text-slate-400">Years</p>
                        </div>
                        <div>
                             <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">{age.months}</p>
                            <p className="text-sm text-slate-400">Months</p>
                        </div>
                        <div>
                             <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">{age.days}</p>
                            <p className="text-sm text-slate-400">Days</p>
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
};
