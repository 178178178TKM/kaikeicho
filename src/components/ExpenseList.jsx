// src/components/ExpenseList.jsx
import { Trash2 } from 'lucide-react';
import { formatYen, monthOf } from '../lib/format.js';

export default function ExpenseList({ expenses, settings, currentMonth, onDelete }) {
  const { categories = [], nameA, nameB } = settings;
  const catMap = Object.fromEntries(categories.map(c => [c.key, c]));
  const colorOf = (cat) => catMap[cat]?.color ?? '#8a8a85';
  const nameOf  = (k)   => k === 'a' ? nameA : nameB;

  const filtered = [...expenses]
    .filter(e => monthOf(e.date) === currentMonth)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  const handleDelete = (id) => {
    if (window.confirm('この記録を削除しますか?')) onDelete(id);
  };

  if (filtered.length === 0) {
    return <div className="text-center py-12 text-stone-400 font-mincho">記録はありません</div>;
  }

  return (
    <div>
      <ul className="divide-y" style={{ borderColor: 'rgba(74,103,65,0.15)' }}>
        {filtered.map(e => {
          const col = colorOf(e.category);
          return (
            <li key={e.id} className="py-3 flex items-center gap-3">
              <div className="text-xs text-stone-500 tab-num font-mincho w-12 flex-shrink-0">
                {e.date.slice(5).replace('-', '/')}
              </div>
              <div className="flex-shrink-0">
                <span className="inline-block px-2 py-0.5 text-[10px] font-mincho border"
                  style={{ borderColor: col, color: col }}>
                  {e.category}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{e.memo || <span className="text-stone-400">—</span>}</div>
                <div className="text-[10px] text-stone-500 font-mincho">{nameOf(e.payer)}</div>
              </div>
              <div className="number-display text-base font-medium flex-shrink-0">{formatYen(e.amount)}</div>
              <button onClick={() => handleDelete(e.id)} aria-label="削除"
                className="p-1 text-stone-400 hover:text-red-700 transition flex-shrink-0">
                <Trash2 size={14} />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 pt-3 border-t flex justify-between items-baseline" style={{ borderColor: '#4a6741' }}>
        <span className="text-xs font-mincho text-stone-600 tracking-widest">月 合 計</span>
        <span className="number-display text-xl font-bold">{formatYen(total)}</span>
      </div>
    </div>
  );
}
