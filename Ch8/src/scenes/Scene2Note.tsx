import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Dust, FilmLook, LetterBox, SceneFade, handheld} from '../components/Atmos';
import {HAND, SCENES, flicker} from '../theme';

const D = SCENES.note.dur;
const TEXT = 'DON’T GO NEAR THE HOUSE.';

/** Scene 2 — close-up of the handwritten note on a wooden floor; a shadow passes over. */
export const Scene2Note: React.FC = () => {
  const f = useCurrentFrame();
  const hh = handheld(f, 0.9);
  const push = interpolate(f, [0, D], [1.0, 1.32], {easing: Easing.inOut(Easing.quad)});
  const rot = interpolate(f, [0, D], [-1.5, 1.2]);
  const chars = Math.floor(interpolate(f, [24, 104], [0, TEXT.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const lamp = 0.82 + 0.18 * flicker(f, 3, 0.15);
  const sx = interpolate(f, [112, 168], [-1300, 2000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  const sOp = interpolate(f, [112, 128, 150, 168], [0, 0.85, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <SceneFade dur={D} inF={6} outF={8}>
      <Audio src={staticFile('audio/creak_floor.wav')} startFrom={0} volume={0.55} />
      <AbsoluteFill style={{background: '#0b0806', transform: `translate(${hh.x}px,${hh.y}px) scale(${push}) rotate(${rot + hh.r}deg)`}}>
        {/* floor planks */}
        <AbsoluteFill style={{
          background: `repeating-linear-gradient(90deg, #2a1b10 0px, #3a2615 60px, #22150c 62px, #33210f 190px, #160d07 193px, #2e1d0f 330px, #130b06 333px),
                       repeating-linear-gradient(0deg, rgba(0,0,0,0.0) 0 40px, rgba(0,0,0,0.18) 41px 43px)`,
        }} />
        <AbsoluteFill style={{background: 'repeating-linear-gradient(88deg, rgba(255,230,180,0.04) 0 2px, rgba(0,0,0,0) 2px 9px)', mixBlendMode: 'overlay'}} />
        {/* pool of moon/lamp light */}
        <AbsoluteFill style={{background: `radial-gradient(ellipse 700px 520px at 960px 540px, rgba(255,190,120,${0.32 * lamp}), rgba(80,110,170,0.10) 55%, rgba(0,0,0,0.0) 80%)`}} />
        {/* the note */}
        <div style={{position: 'absolute', left: 560, top: 250, width: 800, height: 580, transform: 'rotate(-4deg)', filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.8))'}}>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #e9dcc0 0%, #d8c59f 55%, #bfa77c 100%)',
            clipPath: 'polygon(1% 4%, 12% 0%, 30% 3%, 52% 0%, 74% 2%, 97% 0%, 100% 18%, 98% 46%, 100% 72%, 97% 100%, 70% 98%, 45% 100%, 20% 97%, 0% 100%, 2% 70%, 0% 40%)'}} />
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0) 48%, rgba(60,40,10,0.18) 50%, rgba(0,0,0,0) 52%), linear-gradient(0deg, rgba(0,0,0,0) 48%, rgba(60,40,10,0.14) 50%, rgba(0,0,0,0) 52%)'}} />
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(70,40,10,0.45) 100%)'}} />
          <div style={{position: 'absolute', left: 70, right: 70, top: 120, fontFamily: HAND, fontWeight: 700, fontSize: 118, lineHeight: 1.0, color: '#1b0f0a', textAlign: 'center',
            textShadow: '0 0 2px rgba(30,10,5,0.6)', transform: 'rotate(1.2deg)'}}>
            {TEXT.split('').map((c, i) => <span key={i} style={{opacity: i < chars ? 1 : 0}}>{c}</span>)}
          </div>
          <div style={{position: 'absolute', left: 120, right: 160, top: 470, height: 5, borderRadius: 4, background: '#1b0f0a', opacity: chars >= TEXT.length ? 0.8 : 0, transform: 'rotate(-0.6deg)'}} />
        </div>
        {/* shadow passing over the paper */}
        <div style={{position: 'absolute', left: sx, top: -100, width: 900, height: 1400, opacity: sOp, filter: 'blur(60px)',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0) 72%)', transform: 'skewX(-8deg)'}} />
        <Dust count={50} opacity={0.6} />
      </AbsoluteFill>
      <FilmLook vignette={0.92} />
      <LetterBox />
    </SceneFade>
  );
};
