import React, { useState, useCallback } from 'react';

export const PasswordGenerator: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [length, setLength] = useState<number>(16);
    const [useUppercase, setUseUppercase] = useState<boolean>(true);
    const [useNumbers, setUseNumbers] = useState<boolean>(true);
    const [useSymbols, setUseSymbols] = useState<boolean>(true);
    const [copied, setCopied] = useState<boolean>(false);

    const generatePassword = useCallback(() => {
        const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
        const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        let allChars = lowerChars;
        if (useUppercase) allChars += upperChars;
        if (useNumbers) allChars += numberChars;
        if (useSymbols) allChars += symbolChars;
        
        if(allChars === lowerChars && !useUppercase && !useNumbers && !useSymbols) {
          // ensure at least lowercase is used if nothing is selected
           allChars = lowerChars;
        }


        let generatedPassword = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * allChars.length);
            generatedPassword += allChars[randomIndex];
        }
        setPassword(generatedPassword);
        setCopied(false);
    }, [length, useUppercase, useNumbers, useSymbols]);
    
    const copyToClipboard = () => {
        if(password) {
            navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    
    // Generate a password on initial render
    useState(generatePassword);

    return (
        <div>
            <header className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-slate-100">Password Generator</h2>
                <p className="text-slate-400">Create strong and secure passwords</p>
            </header>

            <div className="max-w-lg mx-auto">
                <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-xl p-3 mb-6">
                    <input type="text" value={password} readOnly className="w-full bg-transparent text-white font-mono text-lg focus:outline-none" />
                    <button onClick={copyToClipboard} className="px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 bg-amber-600 text-white hover:bg-amber-500">
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label htmlFor="length" className="text-slate-300">Password Length</label>
                        <input type="number" id="length" value={length} onChange={e => setLength(Math.max(4, Math.min(64, parseInt(e.target.value, 10) || 4)))} className="w-20 bg-slate-800 border border-slate-600 rounded-md p-2 text-center" />
                    </div>
                    <input type="range" min="4" max="64" value={length} onChange={e => setLength(parseInt(e.target.value, 10))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"/>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer p-3 bg-slate-800 rounded-lg hover:bg-slate-700">
                            <input type="checkbox" checked={useUppercase} onChange={() => setUseUppercase(!useUppercase)} className="w-5 h-5 accent-amber-500" />
                            <span>Uppercase</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer p-3 bg-slate-800 rounded-lg hover:bg-slate-700">
                            <input type="checkbox" checked={useNumbers} onChange={() => setUseNumbers(!useNumbers)} className="w-5 h-5 accent-amber-500" />
                            <span>Numbers</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer p-3 bg-slate-800 rounded-lg hover:bg-slate-700">
                            <input type="checkbox" checked={useSymbols} onChange={() => setUseSymbols(!useSymbols)} className="w-5 h-5 accent-amber-500" />
                            <span>Symbols</span>
                        </label>
                    </div>
                </div>

                <button onClick={generatePassword} className="w-full mt-8 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-lg py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:from-amber-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500/50">
                    Generate New Password
                </button>
            </div>
        </div>
    );
};
