// src/components/BreakdownChart.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatYen } from '../lib/format.js';

export default function BreakdownChart({ byCategory, categories, total }) {
  const catMap = Object.fromEntries(categories.map(c => [c.key, c]));
  const colorOf = (key) => catMap[key]?.color ?? '#8a8a85';

  const data = Object.entries(byCategory)
    .map(([name, value]) => ({ name, value, color: colorOf(name) }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return <div className="text-center py-12 text-stone-400 font-mincho">データなし</div>;
  }

  return (
    <div>
      <div className="text-xs font-mincho tracking-widest mb-3 text-center" style={{ color: '#4a6741' }}>
        — 品目別内訳 —
      </div>
      <div className="h-72 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name"
              cx="50%" cy="50%" outerRadius={95} innerRadius={45}
              paddingAngle={1} stroke="#f5f1e8" strokeWidth={2}
              label={({ name, percent }) => percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
              labelLine={false}
              style={{ fontSize: '11px', fontFamily: 'Shippori Mincho B1, serif' }}>
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip
              formatter={(v) => formatYen(v)}
              contentStyle={{ background: '#f5f1e8', border: '1px solid #4a6741', borderRadius: 0, fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 space-y-1.5">
        {data.map(item => {
          const pct = total ? (item.value / total) * 100 : 0;
          return (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <span className="inline-block w-3 h-3 flex-shrink-0" style={{ background: item.color }} />
              <span className="font-mincho flex-1">{item.name}</span>
              <span className="number-display">{formatYen(item.value)}</span>
              <span className="text-stone-400 text-xs w-12 text-right tab-num">{pct.toFixed(1)}%</span>
            </div>
          );
        })}
        <div className="ink-line opacity-30 my-2" />
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-mincho text-stone-600 tracking-widest">合 計</span>
          <span className="number-display text-lg font-bold">{formatYen(total)}</span>
        </div>
      </div>
    </div>
  );
}
