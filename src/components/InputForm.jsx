// src/components/InputForm.jsx
import { useState, useEffect } from 'react';
import { todayStr } from '../lib/format.js';

export default function InputForm({ settings, onAdd }) {
  const { nameA, nameB, categories = [], foodRatioA } = settings;
  const [form, setForm] = useState({
    date: todayStr(),
    payer: 'a',
    category: categories[0]?.key ?? '',
    amount: '',
    memo: '',
  });

  const set = (patch) => setForm(f => ({ ...f, ...patch }));

  // カテゴリが削除されて form.category が無効になったとき先頭に戻す
  useEffect(() => {
    if (categories.length > 0 && !categories.find(c => c.key === form.category)) {
      set({ category: categories[0].key });
    }
  }, [categories]);

  const handleAdd = () => {
    const amt = parseInt(form.amount, 10);
    if (!amt || amt <= 0) return;
    onAdd({
      date: form.date,
      payer: form.payer,
      category: form.category,
      amount: amt,
      memo: form.memo.trim().slice(0, 100),
    });
    set({ amount: '', memo: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-mincho text-stone-600 mb-1 tracking-wider">日付</label>
          <input type="date" value={form.date}
            onChange={e => set({ date: e.target.value })}
            className="w-full px-3 py-2 bg-transparent border-b border-stone-400 focus:border-stone-700 outline-none tab-num text-sm" />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-mincho text-stone-600 mb-1 tracking-wider">支払者</label>
          <div className="flex gap-1 mt-1">
            {[['a', nameA], ['b', nameB]].map(([k, name]) => (
              <button key={k} onClick={() => set({ payer: k })}
                className={`flex-1 py-1.5 text-sm font-mincho transition ${
                  form.payer === k ? 'text-stone-100' : 'bg-stone-200/60 text-stone-600 hover:bg-stone-300/60'
                }`}
                style={form.payer === k ? { background: '#4a6741' } : {}}>
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mincho text-stone-600 mb-2 tracking-wider">品目</label>
        <div className="grid grid-cols-4 gap-1.5">
          {categories.map(c => {
            const active = form.category === c.key;
            return (
              <button key={c.key} onClick={() => set({ category: c.key })}
                className="py-2 text-sm font-mincho border-2 transition"
                style={{
                  borderColor: active ? c.color : '#d4c9b3',
                  color:       active ? c.color : '#888',
                  background:  active ? `${c.color}18` : 'transparent',
                }}>
                <span className="inline-block w-2 h-2 rounded-full mr-1 align-middle" style={{ background: c.color }} />
                {c.key}
                {c.special && active && (
                  <span className="block text-[9px] mt-0.5 opacity-70">{foodRatioA}:{100 - foodRatioA}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-mincho text-stone-600 mb-1 tracking-wider">金額</label>
        <div className="flex items-baseline border-b-2" style={{ borderColor: '#4a6741' }}>
          <span className="font-mincho text-2xl mr-2" style={{ color: '#4a6741' }}>¥</span>
          <input type="number" inputMode="numeric" value={form.amount} placeholder="0"
            onChange={e => set({ amount: e.target.value })}
            className="flex-1 py-2 bg-transparent text-3xl number-display outline-none placeholder:text-stone-300" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mincho text-stone-600 mb-1 tracking-wider">
          摘要 <span className="text-stone-400">(任意)</span>
        </label>
        <input type="text" value={form.memo} placeholder="例: スーパー、外食、薬局"
          onChange={e => set({ memo: e.target.value })}
          className="w-full px-3 py-2 bg-transparent border-b border-stone-400 focus:border-stone-700 outline-none text-sm" />
      </div>

      <button onClick={handleAdd} disabled={!form.amount}
        className="w-full py-3 text-stone-100 font-mincho text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
        style={{ background: '#4a6741', letterSpacing: '0.3em' }}>
        記 帳
      </button>
    </div>
  );
}
