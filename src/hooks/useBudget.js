// src/hooks/useBudget.js
import { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js';
import { DEFAULT_SETTINGS } from '../lib/constants.js';

const DEBOUNCE_MS = 500;

function roomRef(roomId) {
  return doc(db, 'rooms', roomId);
}

function normalize(data) {
  return {
    settings: { ...DEFAULT_SETTINGS, ...(data?.settings ?? {}) },
    expenses: data?.expenses ?? [],
  };
}

export function useBudget(roomId) {
  const [budget, setBudget] = useState(normalize(null));
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;
    const ref = roomRef(roomId);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setBudget(normalize(snap.data()));
        } else {
          const initial = normalize(null);
          setDoc(ref, { ...initial, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
          setBudget(initial);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Firestore snapshot error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      unsub();
      clearTimeout(debounceRef.current);
    };
  }, [roomId]);

  async function write(patch) {
    if (!roomId) return;
    await setDoc(roomRef(roomId), { ...patch, updatedAt: serverTimestamp() }, { merge: true });
  }

  async function addExpense(expense) {
    const entry = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      ...expense,
    };
    const next = [...budget.expenses, entry];
    const prev = budget.expenses;
    setBudget(b => ({ ...b, expenses: next }));
    try {
      await write({ expenses: next });
    } catch (err) {
      console.error('addExpense failed:', err);
      setBudget(b => ({ ...b, expenses: prev }));
      setError(err);
    }
  }

  async function deleteExpense(id) {
    const next = budget.expenses.filter(e => e.id !== id);
    const prev = budget.expenses;
    setBudget(b => ({ ...b, expenses: next }));
    try {
      await write({ expenses: next });
    } catch (err) {
      console.error('deleteExpense failed:', err);
      setBudget(b => ({ ...b, expenses: prev }));
      setError(err);
    }
  }

  function updateSettings(patch) {
    const next = { ...budget.settings, ...patch };
    setBudget(b => ({ ...b, settings: next }));
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => write({ settings: next }), DEBOUNCE_MS);
  }

  async function clearExpenses() {
    const prev = budget.expenses;
    setBudget(b => ({ ...b, expenses: [] }));
    try {
      await write({ expenses: [] });
    } catch (err) {
      console.error('clearExpenses failed:', err);
      setBudget(b => ({ ...b, expenses: prev }));
      setError(err);
    }
  }

  return { budget, loading, error, addExpense, deleteExpense, updateSettings, clearExpenses };
}
