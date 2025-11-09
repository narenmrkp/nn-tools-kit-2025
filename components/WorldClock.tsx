import React, { useState, useEffect } from 'react';

const timezones = [
  'UTC', 'GMT', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 
  'Europe/London', 'Europe/Paris', 'Europe/Moscow', 'Asia/Tokyo', 'Asia/Shanghai', 
  'Asia/Dubai', 'Asia/Kolkata', 'Australia/Sydney', 'Africa/Cairo', 'America/Sao_Paulo'
];

const Clock: React.FC<{ timeZone: string, isLocal?: boolean }> = ({ timeZone, isLocal = false }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const location = isLocal ? "Your Local Time" : timeZone.split('/').pop()?.replace(/_/g, ' ') || timeZone;
  
  return (
    <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 text-center">
      <p className="text-lg font-semibold text-slate-200">{location}</p>
      <p className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
        {time.toLocaleTimeString('en-US', options)}
      </p>
      <p className="text-sm text-slate-400 mt-1">{time.toLocaleDateString('en-US', dateOptions)}</p>
    </div>
  );
};

export const WorldClock: React.FC = () => {
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [selectedClocks, setSelectedClocks] = useState<string[]>(['America/New_York', 'Europe/London', 'Asia/Tokyo']);
  
  const handleAddClock = (tz: string) => {
    if (tz && !selectedClocks.includes(tz) && tz !== localTimeZone) {
      setSelectedClocks([...selectedClocks, tz]);
    }
  };

  return (
    <div>
      <header className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-100">World Clock</h2>
        <p className="text-slate-400">Keep track of time across the globe</p>
      </header>
      
      <div className="max-w-md mx-auto mb-8">
        <Clock timeZone={localTimeZone} isLocal />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-8">
        <select onChange={e => handleAddClock(e.target.value)} defaultValue="" className="w-full sm:w-auto bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
          <option value="" disabled>Add a city...</option>
          {timezones.filter(tz => !selectedClocks.includes(tz) && tz !== localTimeZone).map(tz => (
            <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedClocks.map(tz => (
          <div key={tz} className="relative group">
            <Clock timeZone={tz} />
            <button 
              onClick={() => setSelectedClocks(selectedClocks.filter(c => c !== tz))}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Remove ${tz}`}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};