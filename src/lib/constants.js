// src/lib/constants.js
export const PALETTE = [
  '#b85450', '#4a6741', '#c89968', '#4a6b8a',
  '#8a9a7a', '#8b6f8b', '#8b6f4f', '#8a8a85',
  '#a85a3d', '#5a7a5a', '#d4a574', '#3d5a7a',
  '#7a3d5a', '#5a5a3d', '#7a5a3d', '#5a3d3d',
];

export const DEFAULT_CATEGORIES = [
  { key: '食費',   color: '#b85450', special: true  },
  { key: '家賃',   color: '#4a6741', special: false },
  { key: '光熱費', color: '#c89968', special: false },
  { key: '通信費', color: '#4a6b8a', special: false },
  { key: '日用品', color: '#8a9a7a', special: false },
  { key: '娯楽',   color: '#8b6f8b', special: false },
  { key: '医療',   color: '#8b6f4f', special: false },
  { key: 'その他', color: '#8a8a85', special: false },
];

export const DEFAULT_SETTINGS = {
  nameA: 'あなた',
  nameB: 'パートナー',
  foodRatioA: 60,
  otherRatioA: 50,
  categories: DEFAULT_CATEGORIES,
};
