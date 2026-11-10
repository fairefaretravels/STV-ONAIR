import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Caption, Dust, FilmLook, LetterBox, SceneFade, handheld} from '../components/Atmos';
import {LOOKS, PhotoCat} from '../components/Cats';
import {SERIF, SCENES, flicker, rand} from '../theme';

const D = SCENES.whiskers.dur;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Scene 7 — the old photograph: one face scratched out. Something moves behind it. */
export const Scene7Whiskers: React.FC = () => {
  const f = useCurrentFrame();
  const hh = handheld(f, 0.9);
  const push = interpolate(f, [0, D], [1.0, 1.28], {easing: Easing.inOut(Easing.quad)});
  const lamp = 0.8 + 0.2 * flicker(f, 11, 0.3);
  const sx = interpolate(f, [62, 130], [-420, 1900], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const sOp = interpolate(f, [62, 76, 120, 132], [0, 0.95, 0.95, 0], clamp);
  const staticOn = f >= 78 && f < 156;
  return (
    <SceneFade dur={D} inF={12} outF={14}>
      <Sequence from={78} durationInFrames={78}><Audio src={staticFile('audio/static.wav')} volume={0.55} /></Sequence>
      <Sequence from={94}><Audio src={staticFile('audio/whisper_return.wav')} volume={0.95} /></Sequence>
      <AbsoluteFill style={{background: '#0b0705', transform: `translate(${hh.x}px,${hh.y}px) scale(${push}) rotate(${hh.r}deg)`}}>
        {/* wall */}
        <AbsoluteFill style={{background: 'repeating-linear-gradient(90deg, #1e140c 0 140px, #0c0704 140px 146px)'}} />
        <AbsoluteFill style={{background: `radial-gradient(ellipse 900px 640px at 960px 520px, rgba(255,170,90,${0.38 * lamp}), rgba(0,0,0,0) 75%)`, mixBlendMode: 'screen'}} />
        {/* the thing moving BEHIND the photograph (seen in the gap between wall and frame) */}
        <div style={{position: 'absolute', left: sx, top: 160, width: 360, height: 820, opacity: sOp, filter: 'blur(22px)'}}>
          <svg width={360} height={820} viewBox="0 0 360 820">
            <polygon points="70,170 84,40 140,120" fill="#000" /><polygon points="290,170 276,40 220,120" fill="#000" />
            <ellipse cx={180} cy={220} rx={120} ry={110} fill="#000" /><path d="M 60 300 Q 20 600 90 820 L 270 820 Q 340 600 300 300 Z" fill="#000" />
          </svg>
        </div>
        {/* photograph, hung slightly crooked */}
        <div style={{position: 'absolute', left: 500, top: 190, width: 920, height: 700, transform: 'rotate(-2.2deg)', filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.9))'}}>
          <div style={{position: 'absolute', inset: 0, background: '#e2d3b0', padding: 34}}>
            <div style={{position: 'absolute', inset: 34, background: 'linear-gradient(#a8895a, #6d5636)'}} />
            <div style={{position: 'absolute', left: 34, right: 34, top: 34, bottom: 34, filter: 'sepia(0.9) contrast(1.05) brightness(0.88)', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', paddingTop: 70}}>
              <PhotoCat look={LOOKS.felix} size={220} />
              <PhotoCat look={LOOKS.whiskers} scratched size={230} />
              <PhotoCat look={LOOKS.midnight} size={220} />
            </div>
            <div style={{position: 'absolute', inset: 34, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(40,20,5,0.65) 100%)'}} />
            <div style={{position: 'absolute', inset: 34, background: 'linear-gradient(115deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 30%)'}} />
            <div style={{position: 'absolute', left: 60, bottom: 52, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 26, color: 'rgba(20,10,5,0.75)', transform: 'rotate(-1deg)'}}>The Fraidy Cats — summer, before…</div>
          </div>
          {/* a crease & stain */}
          <div style={{position: 'absolute', left: 0, right: 0, top: 340, height: 3, background: 'rgba(255,255,255,0.18)'}} />
        </div>
        <Dust count={60} opacity={0.6} />
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: staticOn ? 0.12 + 0.08 * rand(f) : 0, mixBlendMode: 'screen', background: `repeating-linear-gradient(${rand(f) * 180}deg, rgba(255,255,255,0.5) 0 1px, rgba(0,0,0,0) 1px 3px)`}} />
      <Caption from={98} to={160} font={SERIF} size={54} italic color="#ffb8b0" glitch>“You shouldn’t have come back.”</Caption>
      <FilmLook vignette={0.92} />
      <LetterBox />
    </SceneFade>
  );
};
