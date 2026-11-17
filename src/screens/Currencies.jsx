import React from 'react';
import { useApp } from '../store.jsx';
import { CUR, hue } from '../data.js';

export default function Currencies() {
  const { S, update, go } = useApp();
  return (
    <>
      <h2>World currencies</h2>
      <p className="mut">Pick a currency. Prices and counting change to match.</p>
      {Object.entries(CUR).map(([k, x], i) => (
        <button key={k} className="card" style={{ width: '100%', textAlign: 'left', display: 'block', color: '#fff', border: 0, background: hue(i * 2, 4) }}
          onClick={() => { update({ cur: k }); go('store'); }}>
          <span style={{ fontSize: 30 }}>{x.s}</span> {x.n} {S.cur === k ? '✓' : ''}
          <div style={{ fontSize: 14, opacity: 0.9 }}>Bills: {x.b.map((v) => x.s + v / 100).join(', ')}</div>
        </button>
      ))}
    </>
  );
}
