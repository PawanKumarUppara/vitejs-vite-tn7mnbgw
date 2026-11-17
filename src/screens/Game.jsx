import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../store.jsx';
import { api } from '../api.js';
import { AV, CUR, hue, lab, money } from '../data.js';

const mmss = (s) => Math.max(0, Math.floor(s / 60)) + ':' + String(Math.max(0, s % 60)).padStart(2, '0');

// Counting screen. mode 'A' = game view (buttons), 'B' = in-hand view (tap or swipe up).
export default function Game() {
  const { S, update, go, game } = useApp();
  const { target, opts } = game;
  const cur = S.cur, c = CUR[cur];
  const max = opts.botAt || opts.live ? 180 : 300;

  const [tray, setTray] = useState([]);
  const [redo, setRedo] = useState([]);
  const [left, setLeft] = useState(max);
  const [mode, setMode] = useState(opts.mode || 'A');
  const [res, setRes] = useState(null);
  const [hint, setHint] = useState(null);
  const [peers, setPeers] = useState({});
  const room = useRef(null), done = useRef(false), L = useRef(max), F = useRef(), p0 = useRef(null);
  const total = tray.reduce((a, b) => a + b, 0);

  const finish = (r, who) => {
    if (done.current) return;
    done.current = true;
    const pts = 10 + Math.max(0, Math.floor(L.current / 6));
    let h, msg = '';
    if (r === 'win') {
      h = '🎉 Perfect count!'; msg = `+${pts} points.`;
      if (opts.item) msg += ` You bought ${opts.item.e} ${opts.item.name}.`;
      if (opts.opp) msg += ` You beat ${opts.opp} and earned $5.00.`;
      if (room.current) room.current.won();
    } else if (r === 'lose') { h = `⏱ ${who || opts.opp} finished first`; msg = 'Count a little faster next time.'; }
    else { h = "⏰ Time's up"; msg = 'Try again. You can do it!'; }
    const spent = opts.item ? opts.item.usd : 0;
    update((s) => ({
      ...(r === 'win' ? { pts: s.pts + pts, wins: s.wins + 1, cash: s.cash - spent + (opts.opp ? 500 : 0), assets: s.assets + spent, items: opts.item ? [...s.items, opts.item.e] : s.items } : {}),
      log: [{ r, t: target, cur, sec: max - L.current, at: new Date().toISOString().slice(0, 10) }, ...s.log].slice(0, 20),
    }));
    setRes({ h, msg });
  };
  F.current = finish;

  useEffect(() => { const id = setInterval(() => setLeft((l) => l - 1), 1000); return () => clearInterval(id); }, []);
  useEffect(() => {
    L.current = left;
    if (done.current) return;
    if (left <= 0) F.current('time');
    else if (opts.botAt && max - left >= opts.botAt) F.current('lose', opts.opp);
  }, [left]);
  useEffect(() => {
    if (!opts.live) return;
    room.current = api.joinRoom(opts.room, { n: S.name || 'Guest', a: AV[S.av] }, { onPeers: setPeers, onWon: (n) => F.current('lose', n) });
    return () => room.current && room.current.leave();
  }, []);
  useEffect(() => { if (room.current) room.current.progress(Math.min(100, Math.round((total / target) * 100))); }, [total]);

  const add = (v) => { if (done.current) return; setTray([...tray, v]); setRedo([]); };
  const undo = () => { if (!tray.length) return; setRedo([...redo, tray[tray.length - 1]]); setTray(tray.slice(0, -1)); };
  const redoIt = () => { if (!redo.length) return; setTray([...tray, redo[redo.length - 1]]); setRedo(redo.slice(0, -1)); };
  const check = () => { if (done.current) return; const d = target - total; if (d === 0) finish('win'); else setHint(d); };
  const quit = () => { done.current = true; go('home'); };
  const pd = (e) => { p0.current = e.clientY; };
  const pu = (e, v) => { if (p0.current == null) return; const d = p0.current - e.clientY; p0.current = null; if (Math.abs(d) < 8 || d > 30) add(v); };

  const A = mode !== 'B', n = c.b.length;
  const bills = A ? (
    <div className="bills">
      {c.b.map((v, i) => <button key={v} className="bill" style={{ background: hue(i, n) }} onClick={() => add(v)}>{lab(v, cur)}</button>)}
    </div>
  ) : (
    <>
      <p className="mut" style={{ textAlign: 'center' }}>Tap or swipe a bill up to count it</p>
      <div className="fan">
        {c.b.map((v, i) => (
          <button key={v} className="bill" style={{ background: hue(i, n), top: i * (190 / n), left: i * (30 / n) + '%', zIndex: i }} onPointerDown={pd} onPointerUp={(e) => pu(e, v)}>{lab(v, cur)}</button>
        ))}
      </div>
    </>
  );
  const coinBg = (i) => (i % 2 ? '#D9DEE6' : '#F2B632');
  const coins = A ? (
    <div className="coins">
      {c.c.map((v, i) => <button key={v} className="coin" style={{ background: coinBg(i) }} onClick={() => add(v)}>{lab(v, cur)}</button>)}
    </div>
  ) : (
    <div className="scat">
      {c.c.map((v, i) => (
        <button key={v} className="coin" style={{ background: coinBg(i), left: 6 + ((i * 29) % 70) + '%', top: (i % 3) * 60 + (i > 2 ? 10 : 0), transform: `rotate(${i * 40}deg)` }} onPointerDown={pd} onPointerUp={(e) => pu(e, v)}>
          <span style={{ display: 'inline-block', transform: `rotate(${-i * 40}deg)` }}>{lab(v, cur)}</span>
        </button>
      ))}
    </div>
  );
  const trayUI = (
    <>
      <div className="card tray">
        {tray.length ? tray.map((v, i) => <b key={i}>{lab(v, cur)}</b>) : <span className="mut">Tap bills and coins to add them</span>}
      </div>
      <div className="row sp">
        <button className="alt" onClick={undo} aria-label="Undo">➖ Undo</button>
        <b className="big" style={{ fontSize: 28 }}>{money(total, cur)}</b>
        <button className="alt" onClick={redoIt} aria-label="Redo">➕ Redo</button>
      </div>
    </>
  );
  const peerRows = Object.values(peers);

  return (
    <>
      <div className="row sp">
        <button className="alt" onClick={quit}>✕ Exit</button>
        <button className="chip" onClick={() => setMode(A ? 'B' : 'A')}>{A ? 'Game view' : 'In-hand view'}</button>
        <span className={'timer' + (left <= 15 ? ' low' : '')}>{mmss(left)}</span>
      </div>
      {opts.opp && <><div className="mut">{opts.av} {opts.opp} is counting…</div><div className="race"><div style={{ width: Math.min(100, ((max - left) / opts.botAt) * 100) + '%' }} /></div></>}
      {opts.live && <div className="card">{peerRows.length ? peerRows.map((p, i) => <div className="pr" key={i}><span>{p.a} {p.n}</span><span>{p.p}%</span></div>) : <span className="mut">Waiting for friends…</span>}</div>}
      <div className="card target"><div className="mut">Count exactly</div><div className="big">{money(target, cur)}</div></div>
      {A ? <>{bills}{trayUI}{coins}</> : <>{trayUI}{bills}{coins}</>}
      <button className="gold" style={{ width: '100%', fontSize: 20 }} onClick={check}>✔ Check my count</button>

      {hint !== null && !res && (
        <div className="ov" onClick={() => setHint(null)}>
          <div className="card"><h2>Not yet</h2>
            <p>You are {hint > 0 ? 'short by' : 'over by'} <b>{money(Math.abs(hint), cur)}</b>. {hint > 0 ? 'Add more.' : 'Undo something.'}</p>
            <button>Keep counting</button></div>
        </div>
      )}
      {res && (
        <div className="ov"><div className="card"><h2>{res.h}</h2><p>{res.msg}</p><button onClick={() => go('home')}>Done</button></div></div>
      )}
    </>
  );
}
