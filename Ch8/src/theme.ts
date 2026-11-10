import {loadFont as loadCinzel} from '@remotion/google-fonts/Cinzel';
import {loadFont as loadCaveat} from '@remotion/google-fonts/Caveat';

export const cinzel = loadCinzel().fontFamily;
export const caveat = loadCaveat().fontFamily;
export const SERIF = `${cinzel}, 'Trajan Pro', Georgia, serif`;
export const HAND = `${caveat}, 'Bradley Hand', 'Segoe Script', cursive`;

export const W = 1920;
export const H = 1080;
export const FPS = 30;

export const C = {
  night: '#05070f',
  navy: '#0a1224',
  deepNavy: '#0d1a33',
  charcoal: '#16181f',
  moon: '#9db8e8',
  moonBright: '#dbe7ff',
  silver: '#c3cad6',
  warm: '#ffb061',
  warmDeep: '#c4651f',
};

/** Scene timeline (frames @30fps). Total = 1800 = 60 s */
export const SCENES = {
  house:    {from: 0,    dur: 240},
  note:     {from: 240,  dur: 180},
  jb:       {from: 420,  dur: 300},
  midnight: {from: 720,  dur: 210},
  radio:    {from: 930,  dur: 180},
  felix:    {from: 1110, dur: 180},
  whiskers: {from: 1290, dur: 180},
  title:    {from: 1470, dur: 330},
} as const;
export const TOTAL = 1800;

/** deterministic pseudo random 0..1 */
export const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** flicker 0..1 : mostly on, with irregular dropouts */
export const flicker = (frame: number, seed = 1, drop = 0.35) => {
  const b = Math.floor(frame / 2);
  const r = rand(b * 1.7 + seed * 13);
  const r2 = rand(Math.floor(frame / 9) + seed * 5);
  const off = r2 < drop ? (r < 0.55 ? 0.12 : 0.6) : 1;
  return off * (0.88 + 0.12 * rand(frame + seed));
};
