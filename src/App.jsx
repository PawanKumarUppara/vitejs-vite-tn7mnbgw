import React from 'react';
import { useApp } from './store.jsx';
import Login from './screens/Login.jsx';
import Home from './screens/Home.jsx';
import Store from './screens/Store.jsx';
import Currencies from './screens/Currencies.jsx';
import Compete from './screens/Compete.jsx';
import Family from './screens/Family.jsx';
import Game from './screens/Game.jsx';

const SCREENS = { login: Login, home: Home, store: Store, cur: Currencies, comp: Compete, fam: Family, game: Game };
const TABS = [['home', '🏠', 'Home'], ['store', '🏪', 'Store'], ['comp', '🌍', 'Compete'], ['cur', '💵', 'Currency'], ['fam', '👪', 'Family']];

export default function App() {
  const { scr, go, game } = useApp();
  const Screen = SCREENS[scr];
  const showNav = scr !== 'login' && scr !== 'game';
  return (
    <div id="app">
      <main>{scr === 'game' ? <Game key={game.id} /> : <Screen />}</main>
      {showNav && (
        <nav>
          {TABS.map(([k, e, t]) => (
            <button key={k} className={scr === k ? 'on' : ''} onClick={() => go(k)}>
              <span>{e}</span>{t}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
