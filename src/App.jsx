// src/App.jsx
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from './firebase.js';
import { useRoom } from './hooks/useRoom.js';
import { useBudget } from './hooks/useBudget.js';
import { calcSettlement } from './lib/calc.js';
import { monthOf, todayStr } from './lib/format.js';
import { DEFAULT_CATEGORIES } from './lib/constants.js';
import Header from './components/Header.jsx';
import MonthSelector from './components/MonthSelector.jsx';
import SummaryCard from './components/SummaryCard.jsx';
import TabNav from './components/TabNav.jsx';
import InputForm from './components/InputForm.jsx';
import ExpenseList from './components/ExpenseList.jsx';
import BreakdownChart from './components/BreakdownChart.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [view, setView] = useState('input');
  const [currentMonth, setCurrentMonth] = useState(monthOf(todayStr()));
  const [toast, setToast] = useState('');

  const roomId = useRoom();
  const { budget, loading, error, addExpense, deleteExpense, updateSettings, clearExpenses } = useBudget(roomId);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthReady(true);
      } else {
        signInAnonymously(auth).catch(err => {
          console.error('signInAnonymously failed:', err);
          setAuthError(err);
        });
      }
    });
    return unsub;
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  if (authError || error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f1e8' }}>
        <div className="text-center p-6">
          <p className="font-mincho text-stone-600 mb-4">接続エラーが発生しました</p>
          <button onClick={() => window.location.reload()}
            className="px-4 py-2 font-mincho text-stone-100"
            style={{ background: '#4a6741' }}>
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  if (!authReady || !roomId || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f1e8' }}>
        <p className="font-mincho text-stone-400 text-sm">準備中…</p>
      </div>
    );
  }

  const { settings, expenses } = budget;
  const categories = settings.categories ?? DEFAULT_CATEGORIES;
  const monthExpenses = expenses.filter(e => monthOf(e.date) === currentMonth);
  const calc = calcSettlement(monthExpenses, settings);

  return (
    <div className="min-h-screen w-full" style={{ background: '#f5f1e8', color: '#1a1a1a' }}>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2 text-stone-100 text-sm font-mincho shadow-lg"
          style={{ background: '#4a6741' }}>
          {toast}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-5 py-6 font-sans-jp paper-grain min-h-screen">
        <Header settings={settings} />
        <MonthSelector currentMonth={currentMonth} onChange={setCurrentMonth} />
        <SummaryCard
          calc={calc}
          nameA={settings.nameA}
          nameB={settings.nameB}
          expenseCount={monthExpenses.length}
        />
        <TabNav active={view} onChange={setView} />

        {view === 'input' && (
          <InputForm settings={settings} onAdd={addExpense} />
        )}
        {view === 'list' && (
          <ExpenseList
            expenses={expenses}
            settings={settings}
            currentMonth={currentMonth}
            onDelete={deleteExpense}
          />
        )}
        {view === 'breakdown' && (
          <BreakdownChart
            byCategory={calc.byCategory}
            categories={categories}
            total={calc.total}
          />
        )}
        {view === 'settings' && (
          <SettingsPanel
            settings={settings}
            roomId={roomId}
            expenses={expenses}
            onUpdateSettings={updateSettings}
            onClearExpenses={clearExpenses}
            showToast={showToast}
          />
        )}

        <footer className="mt-12 pt-4 text-center">
          <div className="ink-line opacity-30 mb-3" />
          <span className="seal">記</span>
        </footer>
      </div>
    </div>
  );
}
