// Back-end layer. This version stores everything in the browser (localStorage + BroadcastChannel,
// so two tabs on one computer can race each other). To go to production, replace each function
// with a fetch() to your server and joinRoom with a WebSocket. The rest of the app does not change.
const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };

export const api = {
  async saveProfile(S) {
    if (!S.code) return;
    set('api:profile:' + S.code, S);
    const board = get('api:board', {});
    board[S.code] = { name: S.name || 'Guest', pts: S.pts, wins: S.wins };
    set('api:board', board);
  },
  async topBoard() {
    return Object.values(get('api:board', {})).sort((a, b) => b.pts - a.pts).slice(0, 5);
  },
  async getExpenses(code) { return get('api:exp:' + code, []); },
  async addExpense(code, e) { const l = get('api:exp:' + code, []); l.push(e); set('api:exp:' + code, l); },
  async getChild(code) {
    const p = get('api:profile:' + code, null);
    return p ? { name: p.name, log: p.log || [] } : null;
  },

  // Live race room. callbacks: { onPeers(peers), onStart(usdCents), onWon(name) }
  joinRoom(code, me, cb) {
    const ch = new BroadcastChannel('race-' + code);
    const id = Math.random().toString(36).slice(2);
    const peers = {};
    const send = (m) => ch.postMessage({ id, ...m });
    ch.onmessage = (e) => {
      const m = e.data;
      if (m.id === id) return;
      if (m.type === 'hello' || m.type === 'prog') {
        peers[m.id] = { n: m.n, a: m.a, p: m.p || 0 };
        cb.onPeers({ ...peers });
        if (m.type === 'hello') send({ type: 'prog', n: me.n, a: me.a, p: 0 });
      }
      if (m.type === 'start') cb.onStart && cb.onStart(m.t);
      if (m.type === 'won') cb.onWon && cb.onWon(m.n);
    };
    send({ type: 'hello', n: me.n, a: me.a });
    return {
      progress: (p) => send({ type: 'prog', n: me.n, a: me.a, p }),
      start: (t) => send({ type: 'start', t }),
      won: () => send({ type: 'won', n: me.n }),
      leave: () => ch.close(),
    };
  },
};
