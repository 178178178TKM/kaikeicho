// src/lib/format.js
export const formatYen = (n) => '¥' + Math.round(n).toLocaleString('ja-JP');

export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

export const monthOf = (s) => s.slice(0, 7);

export const monthLabel = (s) => {
  const [y, m] = s.split('-');
  return `${y}年${parseInt(m)}月`;
};

export const shiftMonth = (s, delta) => {
  const [y, m] = s.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
};
