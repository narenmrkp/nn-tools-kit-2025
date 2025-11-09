
import React from 'react';
import { SwapIcon } from './Icons';

interface SwapButtonProps {
  onClick: () => void;
}

export const SwapButton: React.FC<SwapButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-slate-700/50 border border-slate-600 rounded-full p-3 text-cyan-400 hover:bg-slate-700 hover:text-white hover:rotate-180 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
      aria-label="Swap currencies"
    >
      <SwapIcon className="w-6 h-6" />
    </button>
  );
};
   