import React, { useEffect, useState } from 'react';
import { useApp } from '../store.jsx';
import { api } from '../api.js';
import { CUR, conv, usd } from '../data.js';

const norm = (s) => s.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

export default function Family() {
  const { S, update, startGame } = useApp();
  const [fc, setFc] = useState('');
  const [kid, setKid] = useState(null);
  const [label, setLabel] = useState('');
  const [amt, setAmt] = useState('');

  const pull = async () => update({ exps: await api.getExpenses(S.code) });
  useEffect(() => { pull(); }, []);

  const load = async (code = norm(fc)) => {
    if (!code) return;
    const [child, exps] = await Promise.all([api.getChild(code), api.getExpenses(code)]);
    setKid({ code, child, exps });
  };
  const add = async () => {
    const cents = Math.round(parseFloat(amt) * 100);
    if (!label.trim() || !(cents > 0)) return;
    await api.addExpense(kid.code, { l: label.trim(), c: cents });
    setLabel(''); setAmt(''); load(kid.code);
  };
  const log = kid && kid.child ? kid.child.log : [];

  return (
    <>
      <h2>Family</h2>
      <div className="card">
        <b>For kids: your family code</b>
        <div className="big">{S.code}</div>
        <p className="mut">Give it to a parent. They add real expenses (like groceries) for you to count in the in-hand view.</p>
        <button onClick={pull}>Check for expenses</button>
        {S.exps.length ? S.exps.map((x, i) => (
          <div className="stat" key={i}><span>{x.l} · {usd(x.c)}</span>
            <button onClick={() => startGame(conv(x.c, S.cur), { mode: 'B' })}>Count</button></div>
        )) : <div className="mut">No expenses yet.</div>}
      </div>
      <div className="card">
        <b>For parents: follow a child</b>
        <input placeholder="Child's family code" value={fc} onChange={(e) => setFc(e.target.value)} />
        <button onClick={() => load()}>Load</button>
        {kid && (
          <div style={{ marginTop: 8 }}>
            <p><b>{kid.child ? kid.child.name : 'No activity yet'}</b>: {log.filter((a) => a.r === 'win').length} of {log.length} recent counts correct</p>
            {log.slice(0, 6).map((a, i) => <div className="pr" key={i}><span>{a.at} · {(CUR[a.cur] || { s: '' }).s}{(a.t / 100).toFixed(2)}</span><span>{a.r} · {a.sec}s</span></div>)}
            <p><b>Expenses to count</b></p>
            {kid.exps.map((x, i) => <div className="pr" key={i}><span>{x.l}</span><span>{usd(x.c)}</span></div>)}
            <input placeholder="What was it? e.g. groceries" value={label} onChange={(e) => setLabel(e.target.value)} />
            <input inputMode="decimal" placeholder="Amount in USD" value={amt} onChange={(e) => setAmt(e.target.value)} />
            <button onClick={add}>Add for child</button>
          </div>
        )}
      </div>
    </>
  );
}
