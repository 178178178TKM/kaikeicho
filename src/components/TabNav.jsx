// src/components/TabNav.jsx
import { Plus, List, PieChart, Settings } from 'lucide-react';

const TABS = [
  { key: 'input',     label: '記帳', Icon: Plus     },
  { key: 'list',      label: '一覧', Icon: List     },
  { key: 'breakdown', label: '内訳', Icon: PieChart },
  { key: 'settings',  label: '設定', Icon: Settings },
];

export default function TabNav({ active, onChange }) {
  return (
    <nav className="flex border-b mb-5" style={{ borderColor: 'rgba(74,103,65,0.3)' }}>
      {TABS.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <button key={key} onClick={() => onChange(key)} aria-label={label}
            className={`flex-1 py-2 flex items-center justify-center gap-1.5 text-sm font-mincho transition ${
              isActive ? 'border-b-2 -mb-px' : 'text-stone-500 hover:text-stone-700'
            }`}
            style={isActive ? { color: '#4a6741', borderColor: '#4a6741' } : {}}>
            <Icon size={14} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
