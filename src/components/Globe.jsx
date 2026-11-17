import React, { useEffect, useRef } from 'react';
import { OPP, POLY, RC } from '../data.js';

// Draggable canvas globe. Tap a red dot to pick that player's region.
export default function Globe({ region, onRegion }) {
  const ref = useRef(null);
  const g = useRef({ rot: -95, tgt: -95, drag: false, hold: false, hit: [], lx: null, mv: 0 });
  const regRef = useRef(region);
  regRef.current = region;

  useEffect(() => { g.current.tgt = RC[region]; g.current.hold = true; }, [region]);

  useEffect(() => {
    const c = ref.current, x = c.getContext('2d'), s = g.current, R = 270, C = 300;
    let raf;
    const pr = (la, lo) => {
      const p = (la * Math.PI) / 180, l = ((lo - s.rot) * Math.PI) / 180, t = 0.4;
      return [
        Math.cos(p) * Math.sin(l),
        Math.sin(p) * Math.cos(t) - Math.cos(p) * Math.cos(l) * Math.sin(t),
        Math.sin(p) * Math.sin(t) + Math.cos(p) * Math.cos(l) * Math.cos(t),
      ];
    };
    const paint = () => {
      if (!s.drag && !s.hold) s.tgt += 0.15;
      s.rot += (s.tgt - s.rot) * 0.1;
      x.clearRect(0, 0, 600, 600);
      x.fillStyle = '#4AA3DF'; x.beginPath(); x.arc(C, C, R, 0, 7); x.fill();
      x.fillStyle = '#2E9E5B';
      POLY.forEach((po) => {
        x.beginPath(); let f = 0;
        po.forEach(([a, b]) => {
          const q = pr(a, b); if (q[2] < 0) return;
          const X = C + R * q[0], Y = C - R * q[1];
          f ? x.lineTo(X, Y) : (x.moveTo(X, Y), (f = 1));
        });
        x.fill();
      });
      x.strokeStyle = 'rgba(255,255,255,.3)'; x.lineWidth = 2;
      [-60, -30, 0, 30, 60].forEach((la) => {
        x.beginPath(); let f = 0;
        for (let lo = -180; lo <= 180; lo += 10) {
          const q = pr(la, lo); if (q[2] < 0) { f = 0; continue; }
          const X = C + R * q[0], Y = C - R * q[1];
          f ? x.lineTo(X, Y) : (x.moveTo(X, Y), (f = 1));
        }
        x.stroke();
      });
      s.hit = [];
      OPP.forEach((o) => {
        const q = pr(o[4], o[5]); if (q[2] < 0.05) return;
        const X = C + R * q[0], Y = C - R * q[1], on = o[2] === regRef.current;
        s.hit.push([X, Y, o]);
        x.fillStyle = on ? '#FFC93C' : '#E5484D';
        x.beginPath(); x.arc(X, Y, on ? 15 : 10, 0, 7); x.fill();
        x.strokeStyle = '#fff'; x.stroke();
      });
      raf = requestAnimationFrame(paint);
    };
    paint();
    return () => cancelAnimationFrame(raf);
  }, []);

  const down = (e) => { const s = g.current; s.lx = e.clientX; s.mv = 0; s.drag = true; e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e) => {
    const s = g.current; if (s.lx == null) return;
    const d = e.clientX - s.lx; s.lx = e.clientX; s.mv += Math.abs(d);
    s.tgt -= d * 0.4; s.rot = s.tgt; s.hold = true;
  };
  const up = (e) => {
    const s = g.current; s.drag = false; s.lx = null;
    if (s.mv < 6) {
      const r = ref.current.getBoundingClientRect(), k = 600 / r.width;
      const px = (e.clientX - r.left) * k, py = (e.clientY - r.top) * k;
      const h = s.hit.find(([X, Y]) => Math.hypot(X - px, Y - py) < 30);
      if (h) { onRegion(h[2][2]); s.tgt = h[2][5]; s.hold = true; }
    }
  };

  return <canvas ref={ref} width="600" height="600" aria-label="Interactive globe" onPointerDown={down} onPointerMove={move} onPointerUp={up} />;
}
