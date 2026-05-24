// src/lib/calc.js
export function calcSettlement(expenses, settings) {
  const { foodRatioA = 60, otherRatioA = 50, categories = [], nameA = 'あなた', nameB = 'パートナー' } = settings;
  const catMap = Object.fromEntries(categories.map(c => [c.key, c]));

  let paidA = 0, paidB = 0, shareA = 0, shareB = 0;
  const byCategory = {};

  for (const e of expenses) {
    if (e.payer === 'a') paidA += e.amount;
    else paidB += e.amount;

    const cat = catMap[e.category];
    const rA = (cat?.special ? foodRatioA : otherRatioA) / 100;
    shareA += e.amount * rA;
    shareB += e.amount * (1 - rA);

    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  }

  const balanceA = paidA - shareA;
  const settlement = Math.round(Math.abs(balanceA));
  const fromKey = balanceA >= 0 ? 'b' : 'a';
  const toKey   = balanceA >= 0 ? 'a' : 'b';

  return {
    paidA, paidB,
    shareA: Math.round(shareA),
    shareB: Math.round(shareB),
    total: paidA + paidB,
    settlement,
    fromName: fromKey === 'a' ? nameA : nameB,
    toName:   toKey   === 'a' ? nameA : nameB,
    isZero: settlement === 0,
    byCategory,
  };
}
