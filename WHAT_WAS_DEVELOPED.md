# React version: what was developed

## Deliverable
`dgtl-cash-money-react.zip`: a Vite + React 18 project. Unzip, `npm install`, `npm run dev`.

## Files
| File | Purpose |
|---|---|
| `package.json`, `vite.config.js`, `index.html` | Vite + React setup |
| `src/main.jsx`, `src/App.jsx` | Entry, screen router, bottom nav |
| `src/store.jsx` | Global state (context) with localStorage persistence |
| `src/api.js` | Pluggable back-end layer (localStorage + BroadcastChannel stub) |
| `src/data.js` | USD/EUR/GBP/INR denominations, store items, opponents, helpers |
| `src/components/Globe.jsx` | Canvas globe with drag and tap-to-select |
| `src/screens/Login.jsx` | Log in, Sign up, Skip |
| `src/screens/Home.jsx` | Avatar, liquid, assets, points, net worth |
| `src/screens/Store.jsx` | Categories, items, count the exact price to buy |
| `src/screens/Currencies.jsx` | Currency chooser |
| `src/screens/Compete.jsx` | Globe, regions, bot races, live room, leaderboard |
| `src/screens/Game.jsx` | Counting in game view and in-hand view, undo/redo, timer, hints |
| `src/screens/Family.jsx` | Family code, parent adds expenses, child counts them |
| `README.md` | Setup and production notes |

## Testing done
Bundled with esbuild and run in a headless browser: login, buy an item (correct count), wrong-count hint in in-hand view, bot race screen, family expense flow. No errors. Not run through `npm run dev` itself, since the install needed network access.

## Bug found and fixed
The result and hint boxes could be hidden behind the in-hand bill fan (stacking order). Fixed with `z-index:100` on the overlay in both the React project and the published page.

## Not done
- Real authentication and server (api.js is a local stub)
- Cross-device live races (needs WebSockets)
- Parental consent flow, safer opponent list, bank features
