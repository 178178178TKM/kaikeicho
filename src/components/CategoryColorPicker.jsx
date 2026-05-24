// src/components/CategoryColorPicker.jsx
import { useState, useEffect, useRef } from 'react';
import { PALETTE } from '../lib/constants.js';

export default function CategoryColorPicker({ color, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className="w-6 h-6 border border-stone-400"
        style={{ background: color }}
        aria-label="色を変更" />
      {open && (
        <div className="absolute right-0 top-7 z-20 grid grid-cols-4 gap-1 p-2 border border-stone-400 shadow-lg"
          style={{ background: '#f5f1e8' }}>
          {PALETTE.map(col => (
            <button key={col}
              onClick={() => { onChange(col); setOpen(false); }}
              className="w-6 h-6 border"
              style={{ background: col, borderColor: color === col ? '#1a1a1a' : 'transparent' }}
              aria-label={col} />
          ))}
        </div>
      )}
    </div>
  );
}
