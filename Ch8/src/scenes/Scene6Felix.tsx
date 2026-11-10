import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Caption, Dust, FilmLook, Fog, LetterBox, SceneFade, handheld} from '../components/Atmos';
import {FelixStanding, LOOKS, CatHead} from '../components/Cats';
import {SERIF, SCENES, flicker, rand} from '../theme';

const D = SCENES.felix.dur;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Frame: React.FC<{i: number}> = ({i}) => {
  const w = 120 + rand(i) * 140, h = 150 + rand(i * 3) * 130;
  const looks = [LOOKS.felix, LOOKS.whiskers, LOOKS.midnight];
  return (
    <div style={{position: 'absolute', left: (i % 8) * 235 - 40 + rand(i * 5) * 40, top: 70 + Math.floor(i / 8) * 270 + rand(i * 7) * 50, width: w, height: h,
      background: '#c9b48a', border: '8px solid #2a1a0e', transform: `rotate(${(rand(i * 9) - 0.5) * 8}deg)`, boxShadow: '0 12px 24px rgba(0,0,0,0.7)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, filter: 'sepia(1) contrast(0.9) brightness(0.8)', background: '#b79d70'}}>
        <CatHead look={looks[i % 3]} size={w * 0.8} style={{position: 'absolute', left: w * 0.1, top: h * 0.2}} />
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.0), rgba(0,0,0,0.5))'}} />
    </div>
  );
};

/** Scene 6 — Felix, in a dim wooden room full of old cat photographs. */
export const Scene6Felix: React.FC = () => {
  const f = useCurrentFrame();
  const hh = handheld(f, 0.8);
  const push = interpolate(f, [0, D], [1.0, 1.35], {easing: Easing.inOut(Easing.sin)});
  const lamp = 0.8 + 0.2 * flicker(f, 6, 0.3);
  // Felix glances at the photographs, then turns and looks straight down the lens
  const turn = interpolate(f, [55, 80], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const lookX = interpolate(turn, [0, 1], [-9, 0]);
  const tilt = interpolate(turn, [0, 1], [-8, 0]);
  const headTurn = interpolate(turn, [0, 1], [-18, 0]);
  const blink = (f > 100 && f < 106) ? Math.sin(((f - 100) / 6) * Math.PI) : 0;
  return (
    <SceneFade dur={D} inF={12} outF={12}>
      <Audio src={staticFile('audio/creak_floor.wav')} volume={0.6} />
      <AbsoluteFill style={{background: '#0a0605', transform: `translate(${hh.x}px,${hh.y}px) scale(${push}) rotate(${hh.r}deg)`, transformOrigin: '1060px 480px'}}>
        <AbsoluteFill style={{background: 'repeating-linear-gradient(90deg, #2b1c11 0 150px, #120a05 150px 156px, #24160c 156px 300px, #100803 300px 306px)'}} />
        <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.0) 0 38px, rgba(0,0,0,0.12) 38px 40px)'}} />
        {Array.from({length: 24}).map((_, i) => <Frame key={i} i={i} />)}
        <div style={{position: 'absolute', left: 0, right: 0, top: 960, bottom: 0, background: 'linear-gradient(#1a0f08, #050302)'}} />
        {/* lantern glow from the left */}
        <AbsoluteFill style={{background: `radial-gradient(ellipse 900px 800px at 140px 560px, rgba(255,170,80,${0.5 * lamp}), rgba(0,0,0,0) 70%)`, mixBlendMode: 'screen'}} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 600px 760px at 1060px 560px, rgba(0,0,0,0.0), rgba(0,0,0,0.55) 100%)'}} />
        <div style={{position: 'absolute', left: 880, top: 180, filter: `brightness(${0.65 + 0.3 * lamp}) drop-shadow(0 0 30px rgba(255,170,90,${0.18 * lamp}))`, transform: 'scale(1.08)', transformOrigin: '50% 0'}}>
          <FelixStanding lookX={lookX} lookY={0} blink={blink} headTilt={tilt} headTurn={headTurn} />
        </div>
        <Fog y={950} opacity={0.18} seed={5} speed={0.35} count={6} tint="190,160,130" />
        <Dust count={60} opacity={0.6} />
      </AbsoluteFill>
      <Caption from={86} to={170} font={SERIF} size={54} italic color="#ffe2b8">“I’ve been waiting for you.”</Caption>
      <FilmLook vignette={0.9} />
      <LetterBox />
    </SceneFade>
  );
};
