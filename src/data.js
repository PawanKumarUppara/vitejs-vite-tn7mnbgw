// Currencies: b = bills, c = coins, in minor units (cents). u = smallest unit used for prices.
export const CUR = {
  USD: { s: '$', r: 1, u: 1, m: '¢', n: 'US Dollar', b: [100, 200, 500, 1000, 2000, 5000, 10000], c: [1, 5, 10, 25, 50, 100] },
  EUR: { s: '€', r: 0.92, u: 1, m: 'c', n: 'Euro', b: [500, 1000, 2000, 5000, 10000], c: [1, 2, 5, 10, 20, 50, 100, 200] },
  GBP: { s: '£', r: 0.79, u: 1, m: 'p', n: 'British Pound', b: [500, 1000, 2000, 5000], c: [1, 2, 5, 10, 20, 50, 100, 200] },
  INR: { s: '₹', r: 83, u: 100, m: 'p', n: 'Indian Rupee', b: [1000, 2000, 5000, 10000, 20000, 50000], c: [100, 200, 500, 1000] },
};

// Store items: [emoji, name, price in USD cents]
export const CATS = {
  Toys: [['🚗', 'Toy car', 435], ['⚽', 'Soccer ball', 1250], ['🧸', 'Teddy bear', 1895]],
  School: [['📓', 'Notebook', 280], ['🎒', 'Backpack', 2495], ['🖍️', 'Crayons', 399]],
  Food: [['🍎', 'Apple', 135], ['🍕', 'Pizza slice', 360], ['🍦', 'Ice cream', 475]],
  Fashion: [['👕', 'T-shirt', 940], ['🧢', 'Cap', 1250], ['👟', 'Sneakers', 3995]],
  Tech: [['🎧', 'Headphones', 2499], ['🎮', 'Game', 1975], ['⌚', 'Watch', 4500]],
};

// Opponents: [name, city, region, avatar, lat, lng]
export const OPP = [
  ['Maya', 'Chicago, IL', 'North America', '👩🏾', 41.9, -87.6],
  ['Sam', 'Toronto, CA', 'North America', '🧑🏻', 43.7, -79.4],
  ['Leo', 'São Paulo, BR', 'South America', '👦🏽', -23.5, -46.6],
  ['Aiko', 'Tokyo, JP', 'Asia', '👧🏻', 35.7, 139.7],
  ['Riya', 'Pune, IN', 'Asia', '👧🏽', 18.5, 73.9],
  ['Emma', 'Paris, FR', 'Europe', '👱‍♀️', 48.9, 2.4],
  ['Kofi', 'Accra, GH', 'Africa', '👦🏿', 5.6, -0.2],
  ['Jack', 'Sydney, AU', 'Australia', '🧒🏼', -33.9, 151.2],
];

export const AV = ['🧑🏽', '🦸🏾', '🧑‍🚀', '🦊', '🐼'];
export const RC = { 'North America': -95, 'South America': -60, Asia: 95, Europe: 15, Africa: 20, Australia: 135 };

// Very rough continent outlines [lat, lng] for the canvas globe.
export const POLY = [
  [[70, -160], [60, -95], [50, -55], [25, -80], [15, -95], [30, -118], [50, -128], [62, -150]],
  [[10, -75], [5, -50], [-10, -37], [-35, -55], [-55, -70], [-30, -72], [-5, -80]],
  [[70, 25], [60, 40], [45, 38], [36, 25], [37, -8], [50, -5], [60, 5]],
  [[35, -5], [30, 32], [12, 45], [-10, 40], [-34, 20], [-5, 10], [5, -10], [20, -17]],
  [[70, 70], [70, 170], [50, 140], [20, 120], [8, 105], [10, 78], [25, 60], [40, 45], [55, 60]],
  [[-12, 130], [-12, 143], [-28, 153], [-38, 145], [-35, 117], [-22, 114]],
];

// USD cents -> minor units of the chosen currency, rounded to that currency's smallest unit.
export const conv = (usd, cur) => Math.round((usd * CUR[cur].r) / CUR[cur].u) * CUR[cur].u;
export const money = (m, cur) => CUR[cur].s + (m / 100).toFixed(2);
export const lab = (v, cur) => (v >= 100 ? CUR[cur].s + v / 100 : v + CUR[cur].m);
export const hue = (i, n) => `hsl(${140 + i * (90 / n)},55%,${38 + i * 2}%)`;
export const usd = (c) => '$' + (c / 100).toFixed(2);
