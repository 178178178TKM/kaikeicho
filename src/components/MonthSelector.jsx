// src/components/MonthSelector.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { monthLabel, shiftMonth } from '../lib/format.js';

export default function MonthSelector({ currentMonth, onChange }) {
  return (
    <div className="flex items-center justify-between mb-4 px-2">
      <button onClick={() => onChange(shiftMonth(currentMonth, -1))}
        className="p-2 hover:bg-stone-200/60 rounded transition"
        aria-label="前月">
        <ChevronLeft size={18} style={{ color: '#4a6741' }} />
      </button>
      <div className="font-mincho text-xl tab-num" style={{ letterSpacing: '0.1em' }}>
        {monthLabel(currentMonth)}
      </div>
      <button onClick={() => onChange(shiftMonth(currentMonth, 1))}
        className="p-2 hover:bg-stone-200/60 rounded transition"
        aria-label="翌月">
        <ChevronRight size={18} style={{ color: '#4a6741' }} />
      </button>
    </div>
  );
}
