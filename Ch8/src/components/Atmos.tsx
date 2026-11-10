import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, rand, W, H} from '../theme';

/** Drifting fog banks. */
export const Fog: React.FC<{opacity?: number; y?: number; height?: number; speed?: number; seed?: number; count?: number; tint?: string}> = ({
  opacity = 0.5, y = 700, height = 380, speed = 0.6, seed = 1, count = 12, tint = '170,190,225',
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {Array.from({length: count}).map((_, i) => {
        const w = 700 + rand(i + seed) * 700;
        const sp = speed * (0.5 + rand(i * 3 + seed));
        const x0 = rand(i * 7 + seed) * (W + w);
        const x = ((x0 + frame * sp) % (W + w * 1.2)) - w;
        const yy = y + (rand(i * 11 + seed) - 0.5) * height + Math.sin(frame / 90 + i) * 14;
        const o = opacity * (0.35 + 0.65 * rand(i * 5 + seed));
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: yy, width: w, height: w * 0.32,
            background: `radial-gradient(ellipse at center, rgba(${tint},${o}) 0%, rgba(${tint},${o * 0.5}) 40%, rgba(${tint},0) 70%)`,
            filter: 'blur(26px)',
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

/** Floating dust motes, catches the light. */
export const Dust: React.FC<{count?: number; color?: string; opacity?: number; seed?: number; size?: number}> = ({
  count = 70, color = '255,230,190', opacity = 0.7, seed = 3, size = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {Array.from({length: count}).map((_, i) => {
        const bx = rand(i + seed) * W, by = rand(i * 2 + seed) * H;
        const x = (bx + Math.sin(frame / (60 + rand(i) * 80) + i) * 40 + frame * (0.15 + rand(i * 4) * 0.3) + W) % W;
        const y = (by - frame * (0.1 + rand(i * 6) * 0.35) + H * 3) % H;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / (20 + rand(i * 9) * 30) + i));
        const s = (1 + rand(i * 8) * 3) * size;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%',
          background: `rgba(${color},${opacity * tw})`, boxShadow: `0 0 ${s * 3}px rgba(${color},${opacity * tw * 0.6})`}} />;
      })}
    </AbsoluteFill>
  );
};

const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='400' height='400' filter='url(%23n)'/></svg>`
)}")`;

export const FilmLook: React.FC<{vignette?: number; grain?: number}> = ({vignette = 0.85, grain = 0.12}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{backgroundImage: GRAIN, backgroundPosition: `${rand(frame) * 400}px ${rand(frame + 9) * 400}px`, opacity: grain, mixBlendMode: 'overlay', pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,5,${vignette}) 100%)`, pointerEvents: 'none'}} />
    </>
  );
};

/** 2.39:1 cinematic bars */
export const LetterBox: React.FC<{bar?: number}> = ({bar = 138}) => (
  <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: bar, background: '#000', zIndex: 90}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: bar, background: '#000', zIndex: 90}} />
  </>
);

/** Fade from/to black over a scene. */
export const SceneFade: React.FC<{dur: number; inF?: number; outF?: number; children: React.ReactNode}> = ({dur, inF = 14, outF = 14, children}) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, inF, dur - outF, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: a, background: '#000'}}><AbsoluteFill style={{opacity: 1}}>{children}</AbsoluteFill></AbsoluteFill>;
};

/** Subtitle-style caption that lives in the lower bar area. */
export const Caption: React.FC<{from: number; to: number; children: React.ReactNode; font: string; size?: number; italic?: boolean; color?: string; glitch?: boolean}> = ({
  from, to, children, font, size = 46, italic = true, color = '#e8eefc', glitch = false,
}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [from, from + 8, to - 10, to], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  const g = glitch ? (rand(f) > 0.82 ? (rand(f * 3) - 0.5) * 14 : 0) : 0;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center', zIndex: 95, opacity: o * (glitch && rand(f * 2) > 0.9 ? 0.4 : 1),
      fontFamily: font, fontSize: size, color, fontStyle: italic ? 'italic' : 'normal', letterSpacing: '0.04em',
      textShadow: `${g}px 0 0 rgba(255,60,60,0.6), ${-g}px 0 0 rgba(60,200,255,0.6), 0 2px 18px rgba(0,0,0,0.95)`, transform: `translateX(${g}px)`}}>
      {children}
    </div>
  );
};

/** Gentle handheld sway for any shot. */
export const handheld = (f: number, amt = 1) => ({
  x: (Math.sin(f / 23) * 3 + Math.sin(f / 7.3) * 1.2) * amt,
  y: (Math.cos(f / 29) * 3 + Math.sin(f / 9.1) * 1.1) * amt,
  r: Math.sin(f / 41) * 0.12 * amt,
});

export const Moon: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 120}) => (
  <div style={{position: 'absolute', left: x - r * 4, top: y - r * 4, width: r * 8, height: r * 8,
    background: `radial-gradient(circle at center, #f3f7ff 0%, #dfe9ff ${(r / (r * 4)) * 100}%, rgba(150,185,255,0.35) ${(r / (r * 4)) * 150}%, rgba(80,120,200,0.12) 45%, rgba(0,0,0,0) 70%)`}} />
);

export const Stars: React.FC<{count?: number; h?: number}> = ({count = 140, h = 600}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill>{Array.from({length: count}).map((_, i) => (
    <div key={i} style={{position: 'absolute', left: rand(i) * W, top: rand(i * 3) * h, width: 2, height: 2, borderRadius: '50%',
      background: '#fff', opacity: (0.25 + 0.6 * rand(i * 7)) * (0.7 + 0.3 * Math.sin(f / (15 + rand(i) * 30) + i))}} />
  ))}</AbsoluteFill>;
};

export const NIGHT_SKY = `linear-gradient(180deg, ${C.night} 0%, #0a1430 45%, #14284f 80%, #1d3560 100%)`;
