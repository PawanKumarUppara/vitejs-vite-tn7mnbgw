import React from 'react';
import { useApp } from '../store.jsx';
import { AV, usd } from '../data.js';

export default function Home() {
  const { S, update } = useApp();
  const rows = [['Liquid', usd(S.cash)], [`Assets (${S.items.length} items)`, usd(S.assets)], ['Points', S.pts], ['Wins', S.wins]];
  return (
    <>
      <h2>Hi, {S.name || 'Guest'}!</h2>
      <div className="card">
        <div className="row sp">
          <div style={{ fontSize: 84, lineHeight: 1 }}>{AV[S.av]}</div>
          <button className="alt" onClick={() => update({ av: (S.av + 1) % AV.length })}>Change avatar</button>
        </div>
        {rows.map(([k, v]) => <div className="stat" key={k}><span>{k}</span><b>{v}</b></div>)}
        <div className="stat"><b>Net worth</b><b className="big" style={{ fontSize: 26 }}>{usd(S.cash + S.assets)}</b></div>
      </div>
      {S.items.length ? (
        <div className="card"><b>Your stuff</b><div className="mut">{S.items.join(' ')}</div></div>
      ) : (
        <p className="mut">Open the Store, pick something, and count out the exact price to buy it.</p>
      )}
    </>
  );
}
