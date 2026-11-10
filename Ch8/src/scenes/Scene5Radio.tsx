import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Caption, Dust, FilmLook, LetterBox, SceneFade, handheld} from '../components/Atmos';
import {Radio} from '../components/Radio';
import {SERIF, SCENES, flicker, rand} from '../theme';

const D = SCENES.radio.dur;
const ON = 36, OFF = 114;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Scene 5 — inside the house, the old radio switches on. Static. A whisper. Then silence. */
export const Scene5Radio: React.FC = () => {
  const f = useCurrentFrame();
  const hh = handheld(f, 0.8);
  const live = f >= ON && f < OFF;
  const on = live ? Math.min(1, (f - ON) / 6) * (0.75 + 0.25 * flicker(f, 2, 0.4)) : 0;
  const push = interpolate(f, [0, D], [1.0, 1.55], {easing: Easing.inOut(Easing.quad)});
  const snow = live ? 0.16 + 0.1 * rand(f) : 0;
  const pop = f >= OFF && f < OFF + 3 ? 0.35 : 0;
  return (
    <SceneFade dur={D} inF={10} outF={12}>
      <Sequence from={ON} durationInFrames={OFF - ON}><Audio src={staticFile('audio/static.wav')} volume={0.8} /></Sequence>
      <Sequence from={66}><Audio src={staticFile('audio/whisper_names.wav')} volume={0.9} /></Sequence>
      <AbsoluteFill style={{background: '#06080f', transform: `translate(${hh.x}px,${hh.y}px) scale(${push})`, transformOrigin: '960px 560px'}}>
        {/* room: back wall + moon shaft through a boarded window */}
        <AbsoluteFill style={{background: 'repeating-linear-gradient(90deg, #14100e 0 118px, #0b0807 118px 122px)'}} />
        <div style={{position: 'absolute', left: 80, top: 90, width: 360, height: 520, background: '#0f1a30', border: '14px solid #1b140f'}} />
        <div style={{position: 'absolute', left: 80, top: 90, width: 360, height: 520, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.85) 0 26px, rgba(0,0,0,0) 26px 70px)'}} />
        <div style={{position: 'absolute', left: 120, top: 140, width: 1400, height: 800, background: 'linear-gradient(100deg, rgba(150,180,240,0.25), rgba(150,180,240,0) 70%)', clipPath: 'polygon(0 0, 12% 0, 90% 100%, 40% 100%)', filter: 'blur(14px)'}} />
        {/* table */}
        <div style={{position: 'absolute', left: 380, right: 380, top: 830, height: 40, background: 'linear-gradient(#3a2819,#1a110a)'}} />
        <div style={{position: 'absolute', left: 380, right: 380, top: 870, bottom: 0, background: 'linear-gradient(#150d08,#050302)'}} />
        <div style={{position: 'absolute', left: 580, top: 280, filter: `drop-shadow(0 0 ${on * 50}px rgba(255,160,70,${on * 0.5}))`}}>
          <Radio on={on} frame={f} />
        </div>
        {/* warm spill on table & wall */}
        <AbsoluteFill style={{background: `radial-gradient(ellipse 800px 500px at 960px 600px, rgba(255,150,60,${0.30 * on}), rgba(0,0,0,0) 70%)`, mixBlendMode: 'screen'}} />
        <Dust count={70} opacity={0.5} />
      </AbsoluteFill>
      {/* static snow + scanline glitch while the radio is live */}
      <AbsoluteFill style={{opacity: snow, mixBlendMode: 'screen', background: `repeating-linear-gradient(${rand(f) * 180}deg, rgba(255,255,255,0.5) 0 1px, rgba(0,0,0,0) 1px 3px)`}} />
      <AbsoluteFill style={{background: '#fff', opacity: pop, mixBlendMode: 'screen'}} />
      <Caption from={68} to={110} font={SERIF} size={64} italic={false} color="#ffd9a8" glitch>Jamie… Brock…</Caption>
      <FilmLook vignette={0.92} />
      <LetterBox />
    </SceneFade>
  );
};
