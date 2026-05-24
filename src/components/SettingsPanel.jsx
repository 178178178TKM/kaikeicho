// src/components/SettingsPanel.jsx
import { useState } from 'react';
import { Plus, Trash2, Link2, RotateCcw } from 'lucide-react';
import { PALETTE } from '../lib/constants.js';
import CategoryColorPicker from './CategoryColorPicker.jsx';

export default function SettingsPanel({
  settings,
  roomId,
  expenses,
  onUpdateSettings,
  onClearExpenses,
  showToast,
}) {
  const { nameA, nameB, foodRatioA, otherRatioA, categories = [] } = settings;
  const [shareUrl, setShareUrl] = useState('');

  const handleCopyUrl = async () => {
    const url = `${window.location.origin}${window.location.pathname}#room=${roomId}`;
    setShareUrl(url);
    try {
      await navigator.clipboard.writeText(url);
      showToast('URLをコピーしました');
    } catch {
      showToast('URLを生成しました(手動でコピーしてください)');
    }
  };

  const addCategory = () => {
    const newCat = {
      key: '新規' + (categories.length + 1),
      color: PALETTE[categories.length % PALETTE.length],
      special: false,
    };
    onUpdateSettings({ categories: [...categories, newCat] });
  };

  const updateCategory = (idx, patch) => {
    onUpdateSettings({ categories: categories.map((c, i) => i === idx ? { ...c, ...patch } : c) });
  };

  const deleteCategory = (idx) => {
    const cat = categories[idx];
    const usedCount = expenses.filter(e => e.category === cat.key).length;
    const msg = usedCount > 0
      ? `「${cat.key}」は${usedCount}件の記録で使われています。削除しても記録は残ります。続行しますか?`
      : `「${cat.key}」を削除しますか?`;
    if (!window.confirm(msg)) return;
    onUpdateSettings({ categories: categories.filter((_, i) => i !== idx) });
  };

  const handleClear = async () => {
    if (!window.confirm('全ての記録を削除します(品目・設定は残ります)。よろしいですか?')) return;
    await onClearExpenses();
    showToast('記録を削除しました');
  };

  return (
    <div className="space-y-6">
      {/* データ共有 */}
      <section className="p-4 border border-stone-300" style={{ background: 'rgba(255,253,247,0.5)' }}>
        <div className="text-xs font-mincho tracking-widest mb-3" style={{ color: '#4a6741' }}>— データ共有 —</div>
        <button onClick={handleCopyUrl}
          className="w-full py-2.5 text-stone-100 font-mincho text-sm flex items-center justify-center gap-2 mb-3"
          style={{ background: '#4a6741', letterSpacing: '0.15em' }}>
          <Link2 size={14} /> 共有URLをコピー
        </button>
        {shareUrl && (
          <div className="mb-2">
            <textarea value={shareUrl} readOnly rows={2}
              onClick={e => e.target.select()}
              className="w-full text-[10px] font-mono p-2 bg-stone-100 border border-stone-300 break-all resize-none" />
          </div>
        )}
        <p className="text-[11px] text-stone-500 font-mincho leading-relaxed">
          このURLを相手に送ると、同じデータをリアルタイムで共有できます。
        </p>
      </section>

      {/* 人物 */}
      <section>
        <div className="text-xs font-mincho tracking-widest mb-3" style={{ color: '#4a6741' }}>— 人物 —</div>
        <div className="space-y-3">
          {[['nameA', '甲', nameA], ['nameB', '乙', nameB]].map(([key, label, val]) => (
            <div key={key}>
              <label className="block text-xs font-mincho text-stone-600 mb-1">{label}</label>
              <input type="text" value={val}
                onChange={e => onUpdateSettings({ [key]: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border-b border-stone-400 focus:border-stone-700 outline-none" />
            </div>
          ))}
        </div>
      </section>

      {/* 負担比率 */}
      <section>
        <div className="text-xs font-mincho tracking-widest mb-3" style={{ color: '#4a6741' }}>— 負担比率 —</div>
        <div className="space-y-3">
          {[
            ['foodRatioA',  '6:4適用品目(下記で指定)', foodRatioA],
            ['otherRatioA', 'その他',                   otherRatioA],
          ].map(([key, label, val]) => (
            <div key={key}>
              <label className="block text-xs font-mincho text-stone-600 mb-1">{label}</label>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mincho">{nameA}</span>
                <input type="number" min="0" max="100" value={val}
                  onChange={e => onUpdateSettings({ [key]: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
                  className="w-16 px-2 py-1 bg-transparent border-b border-stone-400 text-center number-display" />
                <span className="text-stone-500">:</span>
                <span className="w-16 text-center number-display">{100 - val}</span>
                <span className="text-sm font-mincho">{nameB}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 品目 */}
      <section>
        <div className="text-xs font-mincho tracking-widest mb-3" style={{ color: '#4a6741' }}>— 品目 —</div>
        <ul className="space-y-2 mb-3">
          {categories.map((c, i) => (
            <li key={i} className="flex items-center gap-2 p-2 border border-stone-300"
              style={{ background: 'rgba(255,253,247,0.3)' }}>
              <input type="text" value={c.key}
                onChange={e => updateCategory(i, { key: e.target.value })}
                className="flex-1 min-w-0 px-2 py-1 bg-transparent border-b border-stone-400 text-sm" />
              <CategoryColorPicker color={c.color} onChange={col => updateCategory(i, { color: col })} />
              <label className="flex items-center gap-1 text-[10px] font-mincho text-stone-600 cursor-pointer flex-shrink-0">
                <input type="checkbox" checked={c.special}
                  onChange={e => updateCategory(i, { special: e.target.checked })} />
                6:4
              </label>
              <button onClick={() => deleteCategory(i)} aria-label="品目を削除"
                className="p-1 text-stone-400 hover:text-red-700 flex-shrink-0">
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
        <button onClick={addCategory}
          className="w-full py-2 border-2 border-dashed font-mincho text-sm flex items-center justify-center gap-1.5"
          style={{ borderColor: '#4a6741', color: '#4a6741' }}>
          <Plus size={14} /> 品目を追加
        </button>
      </section>

      {/* 危険操作 */}
      <section>
        <div className="ink-line opacity-30 my-2" />
        <button onClick={handleClear}
          className="flex items-center gap-2 text-xs hover:opacity-70 transition font-mincho"
          style={{ color: '#b85450' }}>
          <RotateCcw size={12} /> 全記録を消去
        </button>
      </section>
    </div>
  );
}
