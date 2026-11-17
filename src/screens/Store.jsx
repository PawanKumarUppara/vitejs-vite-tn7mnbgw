import React, { useState } from 'react';
import { useApp } from '../store.jsx';
import { CATS, conv, money } from '../data.js';

export default function Store() {
  const { S, startGame } = useApp();
  const [cat, setCat] = useState('Toys');
  const [i, setI] = useState(0);
  const items = CATS[cat];
  const [emoji, name, price] = items[i];
  const afford = price <= S.cash;
  return (
    <>
      <h2>Virtual Store</h2>
      <div className="h">
        {Object.keys(CATS).map((c) => (
          <button key={c} className={'chip' + (c === cat ? ' on' : '')} onClick={() => { setCat(c); setI(0); }}>{c}</button>
        ))}
      </div>
      <div className="h" style={{ margin: '10px 0' }}>
        {items.map((x, k) => (
          <button key={x[1]} className={'item' + (k === i ? ' on' : '')} onClick={() => setI(k)}>
            <i>{x[0]}</i>{x[1]}
          </button>
        ))}
      </div>
      <div className="card target">
        <div className="mut">{name} costs</div>
        <div className="big">{money(conv(price, S.cur), S.cur)}</div>
        <div className="mut">{S.cur} · you have {money(conv(S.cash, S.cur), S.cur)}</div>
        <p><button disabled={!afford} onClick={() => startGame(conv(price, S.cur), { item: { e: emoji, name, usd: price } })}>Count it out</button></p>
        {!afford && <div className="mut">Not enough money yet. Win a race in Compete to earn more.</div>}
      </div>
    </>
  );
}
