import React, { useState } from 'react';
import { useApp } from '../store.jsx';

export default function Login() {
  const { S, update, go } = useApp();
  const [name, setName] = useState(S.name);
  const enter = () => { if (!name.trim()) return; update({ name: name.trim() }); go('home'); };
  return (
    <>
      <div style={{ textAlign: 'center', paddingTop: 24 }}>
        <div style={{ fontSize: 84 }}>💰</div>
        <h1>DGTL$Cash Money</h1>
        <p className="mut">Count it. Earn it. Learn it.</p>
      </div>
      <div className="card">
        <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
        <button style={{ width: '100%', marginBottom: 8 }} onClick={enter}>Log in</button>
        <button className="alt" style={{ width: '100%' }} onClick={enter}>Sign up</button>
      </div>
      <p style={{ textAlign: 'center' }}>
        <button className="alt" onClick={() => { update({ name: S.name || 'Guest' }); go('cur'); }}>Skip</button>
      </p>
      <p className="mut" style={{ textAlign: 'center' }}>Demo login: your name is saved in this browser only. Replace with real auth in api.js.</p>
    </>
  );
}
