// src/components/Header.jsx
export default function Header({ settings }) {
  const { nameA, nameB, foodRatioA, otherRatioA } = settings;
  return (
    <header className="mb-6">
      <div className="flex items-baseline justify-between mb-1">
        <h1 className="font-mincho text-3xl font-bold" style={{ letterSpacing: '0.15em' }}>家計帖</h1>
        <span className="text-xs font-mincho tracking-widest" style={{ color: '#4a6741' }}>折半之記録</span>
      </div>
      <div className="ink-line mb-2" />
      <p className="text-xs text-stone-600 font-mincho tracking-wide">
        {nameA} ／ {nameB}
        <span className="mx-2 text-stone-400">|</span>
        6:4品目 {foodRatioA}:{100 - foodRatioA}
        <span className="mx-2 text-stone-400">|</span>
        その他 {otherRatioA}:{100 - otherRatioA}
      </p>
    </header>
  );
}
