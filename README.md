# DGTL$Cash Money (React + Vite)

Financial-literacy app for K-5 children: count virtual bills and coins to an exact amount, buy items from a virtual store, race other players, and count real family expenses.

## Run it
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```
Requires Node 18+.

## Structure
```
src/
  main.jsx            entry
  App.jsx             screen router + bottom nav
  store.jsx           app state (React context), saved to localStorage
  api.js              BACK-END LAYER: swap these functions for your server
  data.js             currencies, store items, opponents, helpers (integer-cent math)
  styles.css
  components/Globe.jsx   canvas globe (drag, tap a dot)
  screens/               Login, Home, Store, Currencies, Compete, Game, Family
```

## Going to production
`src/api.js` currently uses localStorage and BroadcastChannel (so two browser tabs can race each other). Replace:
- `saveProfile`, `topBoard`, `getExpenses`, `addExpense`, `getChild` with `fetch()` calls to your API
- `joinRoom` with a WebSocket connection (same callbacks: onPeers, onStart, onWon)
- the demo login in `Login.jsx` with real auth, and add parental consent (COPPA) before collecting any child data

## Rules the code follows
- All money is integer minor units (cents), never floats.
- A count is correct only when the tray total equals the target exactly.
- Overlays use `z-index:100` so they sit above the in-hand bill fan.
