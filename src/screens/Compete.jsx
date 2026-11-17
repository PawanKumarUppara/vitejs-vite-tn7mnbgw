import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../store.jsx';
import { api } from '../api.js';
import Globe from '../components/Globe.jsx';
import { AV, OPP, RC, conv } from '../data.js';

export default function Compete() {
  const { S, startGame } = useApp();
  const [reg, setReg] = useState('North America');
  const [board, setBoard] = useState([]);
  const [code, setCode] = useState('');
  const [joined, setJoined] = useState('');
  const [peers, setPeers] = useState({});
  const room = useRef(null);

  useEffect(() => { api.topBoard().then(setBoard); }, []);
  useEffect(() => () => room.current && room.current.leave(), []);

  const race = (o) => {
    const t = conv(500 + Math.floor(Math.random() * 2500), S.cur);
    startGame(t, { opp: o[0], av: o[3], botAt: 25 + Math.floor(Math.random() * 35) });
  };
  const join = () => {
    const c = code.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!c) return;
    if (room.current) room.current.leave();
    setPeers({});
    room.current = api.joinRoom(c, { n: S.name || 'Guest', a: AV[S.av] }, {
      onPeers: setPeers,
      onStart: (t) => { room.current.leave(); startGame(conv(t, S.cur), { live: true, room: c }); },
    });
    setJoined(c);
  };
  const liveStart = () => {
    const t = 500 + Math.floor(Math.random() * 2500);
    room.current.start(t); room.current.leave();
    startGame(conv(t, S.cur), { live: true, room: joined });
  };
  const list = OPP.filter((o) => o[2] === reg);
  const pe = Object.values(peers);

  return (
    <>
      <h2>Compete</h2>
      <Globe region={reg} onRegion={setReg} />
      <p className="mut" style={{ textAlign: 'center' }}>Drag the globe. Tap a dot to find players there.</p>
      <div className="h">
        {Object.keys(RC).map((r) => <button key={r} className={'chip' + (r === reg ? ' on' : '')} onClick={() => setReg(r)}>{r}</button>)}
      </div>
      <div className="h" style={{ marginTop: 10 }}>
        {list.map((o) => (
          <div className="card opp" key={o[0]}>
            <i>{o[3]}</i><b>{o[0]}</b><div className="mut">{o[1]}</div>
            <button onClick={() => race(o)}>Race</button>
          </div>
        ))}
      </div>
      <div className="card">
        <b>Live race with friends</b>
        <div className="mut">Open this page in two tabs, enter the same room code. (Swap api.js for WebSockets to race across devices.)</div>
        <input placeholder="Room code, e.g. maple7" value={code} onChange={(e) => setCode(e.target.value)} />
        <button onClick={join}>Join</button>
        {joined && (
          <div style={{ marginTop: 8 }}>
            {pe.length ? pe.map((p, i) => <div className="pr" key={i}><span>{p.a} {p.n}</span><span>{p.p}%</span></div>) : <div className="mut">Waiting for friends to join…</div>}
            <button onClick={liveStart}>Start race for everyone</button>
          </div>
        )}
      </div>
      <div className="card">
        <b>Top counters</b>
        {board.length ? board.map((b, i) => <div className="pr" key={i}><span>{i + 1}. {b.name}</span><span>{b.pts} pts</span></div>) : <div className="mut">Nobody yet. Win a count to get on the board.</div>}
      </div>
    </>
  );
}
