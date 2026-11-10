import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Caption, Dust, FilmLook, Fog, LetterBox, Moon, NIGHT_SKY, SceneFade, Stars, handheld} from '../components/Atmos';
import {Treeline} from '../components/Scenery';
import {MidnightSitting} from '../components/Cats';
import {SCENES} from '../theme';

const D = SCENES.midnight.dur;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Scene 4 — a silver bell rings in the dark; Midnight watches from the fence; push toward the bell. */
export const Scene4Midnight: React.FC = () => {
  const f = useCurrentFrame();
  const hh = handheld(f, 0.7);
  const ring = f - 9; // bell strikes at 24.3 s
  const swing = ring > 0 ? Math.sin(ring / 2.4) * 14 * Math.exp(-ring / 40) : 0;
  const push = interpolate(f, [0, D], [1, 3.4], {easing: Easing.inOut(Easing.cubic)});
  const focusX = interpolate(f, [0, D], [900, 1235]), focusY = interpolate(f, [0, D], [620, 475]);
  const catIn = interpolate(f, [28, 70], [0, 1], clamp);
  const glow = 0.6 + 0.4 * catIn + 0.15 * Math.sin(f / 8);
  const blink = f > 120 && f < 128 ? Math.sin(((f - 120) / 8) * Math.PI) : 0;
  return (
    <SceneFade dur={D} inF={4} outF={12}>
      <Sequence from={9}><Audio src={staticFile('audio/bell.wav')} volume={0.9} /></Sequence>
      <AbsoluteFill style={{background: NIGHT_SKY, transform: `translate(${hh.x}px,${hh.y}px) scale(${push})`, transformOrigin: `${focusX}px ${focusY}px`}}>
        <Stars h={520} />
        <Moon x={620} y={260} r={130} />
        <Treeline seed={14} color="#0a1430" width={2400} height={700} count={30} minH={300} maxH={560} style={{position: 'absolute', left: -240, top: 360}} />
        <Fog y={760} opacity={0.4} seed={4} speed={0.5} count={10} />
        {/* wooden fence */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 800, bottom: 0, background: 'linear-gradient(#0a1020,#03050a)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 830, height: 22, background: 'linear-gradient(#2b2a33,#14131a)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 900, height: 22, background: 'linear-gradient(#2b2a33,#14131a)'}} />
        {Array.from({length: 17}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: i * 130 - 20, top: 780 + (i % 3) * 8, width: 70, height: 340,
            background: 'linear-gradient(90deg,#22212b,#3a3946 45%,#15141b)', clipPath: 'polygon(0 12%, 50% 0, 100% 12%, 100% 100%, 0 100%)', transform: `rotate(${(i % 5 - 2) * 0.8}deg)`}} />
        ))}
        {/* far silhouettes of Jamie & Brock with flashlights */}
        <div style={{position: 'absolute', left: 170, top: 700, width: 280, height: 220, opacity: 0.8}}>
          <Img src={staticFile('art/brock_back.png')} style={{position: 'absolute', left: 20, bottom: 0, height: 190, filter: 'brightness(0.45) blur(1.5px)', WebkitMaskImage: 'radial-gradient(ellipse 52% 56% at 50% 50%, #000 62%, transparent 100%)'}} />
          <Img src={staticFile('art/jamie_back.png')} style={{position: 'absolute', left: 140, bottom: 0, height: 195, filter: 'brightness(0.45) blur(1.5px)', WebkitMaskImage: 'radial-gradient(ellipse 52% 56% at 50% 50%, #000 62%, transparent 100%)'}} />
        </div>
        {/* Midnight on the fence post */}
        <div style={{position: 'absolute', left: 1040, top: 330, opacity: catIn, transform: `translateY(${(1 - catIn) * 12}px)`}}>
          {/* moonlight rim */}
          <div style={{position: 'absolute', inset: -40, background: 'radial-gradient(ellipse at 30% 25%, rgba(160,190,255,0.22), rgba(0,0,0,0) 60%)'}} />
          <MidnightSitting bellSwing={swing} glow={glow} blink={blink} tailSway={Math.sin(f / 22) * 14} />
        </div>
        {/* ring ripples */}
        {[0, 8, 16].map((d, i) => {
          const r = ring - d; if (r < 0 || r > 60) return null;
          const s = r / 60;
          return <div key={i} style={{position: 'absolute', left: 1235 - 160 * s - 20, top: 495 - 160 * s - 20, width: 320 * s + 40, height: 320 * s + 40, borderRadius: '50%',
            border: '2px solid rgba(200,220,255,0.7)', opacity: (1 - s) * 0.8}} />;
        })}
        <Fog y={960} opacity={0.35} seed={9} speed={1.2} count={8} />
        <Dust count={40} color="190,210,255" opacity={0.6} />
      </AbsoluteFill>
      <Caption from={60} to={140} font="Georgia, serif" size={30} color="#9fb0d0">Something was watching from the fence.</Caption>
      <FilmLook vignette={0.9} />
      <LetterBox />
    </SceneFade>
  );
};
