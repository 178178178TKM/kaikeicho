// src/components/SummaryCard.jsx
import { formatYen } from '../lib/format.js';

export default function SummaryCard({ calc, nameA, nameB, expenseCount }) {
  return (
    <div className="mb-6 p-5 border"
      style={{ background: 'rgba(255,253,247,0.7)', borderColor: '#4a6741', borderWidth: '1px' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-mincho tracking-widest" style={{ color: '#4a6741' }}>— 当月清算 —</div>
        <div className="text-xs text-stone-500 tab-num">{expenseCount}件</div>
      </div>
      {calc.isZero ? (
        <div className="text-center py-3">
          <div className="font-mincho text-2xl text-stone-400">清算なし</div>
          <div className="text-xs text-stone-500 mt-1">この月の記録はまだありません</div>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-sm font-mincho mb-2">
            <span className="font-bold">{calc.fromName}</span>
            <span className="mx-1 text-stone-500">→</span>
            <span className="font-bold">{calc.toName}</span>
          </div>
          <div className="number-display text-4xl font-bold">{formatYen(calc.settlement)}</div>
          <div className="text-xs text-stone-500 mt-2 font-mincho">支払うことで清算</div>
        </div>
      )}
      <div className="ink-line my-4 opacity-50" />
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-stone-500 mb-1">{nameA} 支出</div>
          <div className="number-display text-lg">{formatYen(calc.paidA)}</div>
          <div className="text-stone-500 text-[10px] mt-1">負担額 {formatYen(calc.shareA)}</div>
        </div>
        <div className="text-right">
          <div className="text-stone-500 mb-1">{nameB} 支出</div>
          <div className="number-display text-lg">{formatYen(calc.paidB)}</div>
          <div className="text-stone-500 text-[10px] mt-1">負担額 {formatYen(calc.shareB)}</div>
        </div>
      </div>
    </div>
  );
}
