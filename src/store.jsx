import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const Ctx = createContext(null);
const DEF = { name: '', cur: 'USD', cash: 20000, assets: 0, pts: 0, wins: 0, av: 0, items: [], log: [], exps: [], code: '' };

function load() {
  let s = DEF;
  try { s = { ...DEF, ...JSON.parse(localStorage.getItem('dgtl') || '{}') }; } catch { /* ignore */ }
  if (!s.code) s.code = Math.random().toString(36).slice(2, 7);
  return s;
}

export function AppProvider({ children }) {
  const [S, setS] = useState(load);
  const [scr, go] = useState('login');
  const [game, setGame] = useState(null);

  useEffect(() => {
    try { localStorage.setItem('dgtl', JSON.stringify(S)); } catch { /* ignore */ }
    api.saveProfile(S);
  }, [S]);

  const update = (p) => setS((s) => ({ ...s, ...(typeof p === 'function' ? p(s) : p) }));
  const startGame = (target, opts = {}) => { setGame({ target, opts, id: Date.now() }); go('game'); };

  return <Ctx.Provider value={{ S, update, scr, go, game, startGame }}>{children}</Ctx.Provider>;
}

export const useApp = () => useContext(Ctx);
