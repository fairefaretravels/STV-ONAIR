import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Dust, FilmLook, Fog, LetterBox, Moon, NIGHT_SKY, Stars} from '../components/Atmos';
import {House, Treeline} from '../components/Scenery';
import {SERIF, SCENES} from '../theme';

const D = SCENES.title.dur;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Word: React.FC<{text: string; start: number; size: number}> = ({text, start, size}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', justifyContent: 'center', gap: size * 0.06}}>
      {text.split('').map((c, i) => {
        const s = spring({frame: f - start - i * 5, fps, config: {damping: 18, stiffness: 55, mass: 1.4}});
        const o = interpolate(s, [0, 0.5, 1], [0, 0.7, 1]);
        return (
          <span key={i} style={{display: 'inline-block', fontFamily: SERIF, fontWeight: 900, fontSize: size, letterSpacing: '0.05em', lineHeight: 1,
            opacity: o, transform: `translateY(${(1 - s) * 40}px) scale(${0.82 + 0.18 * s})`, filter: `blur(${(1 - s) * 18}px)`,
            background: 'linear-gradient(180deg, #ffffff 0%, #c9d3e6 42%, #7c88a3 58%, #d9e2f2 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            WebkitTextFillColor: 'transparent', textShadow: 'none'}}>{c}</span>
        );
      })}
    </div>
  );
};

/** Scene 8 — black, a silver bell, the title emerges, then two eyes in the window. */
export const Scene8Title: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const TITLE_START = 52;
  const STING = 90;
  const flash = interpolate(f, [STING, STING + 3, STING + 18], [0, 0.5, 0], clamp);
  const shine = interpolate(f, [STING, STING + 40], [-300, 1500], clamp);
  const titleOut = interpolate(f, [228, 240], [1, 0], clamp);
  const tag = spring({frame: f - 120, fps, config: {damping: 200}});
  const tagLetter = interpolate(tag, [0, 1], [0.6, 0.22]);
  const glow = interpolate(f, [STING, STING + 30, 200], [0, 1, 0.55], clamp);
  const houseIn = f >= 236;
  const eyes = interpolate(f, [252, 256, 274, 278], [0, 1, 1, 0], clamp);
  const bellPulse = f > 36 && f < 80 ? Math.exp(-(f - 36) / 18) : 0;
  const push = interpolate(f, [236, 290], [1.0, 1.25], {...clamp, easing: Easing.inOut(Easing.quad)});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence from={36}><Audio src={staticFile('audio/bell.wav')} volume={0.9} /></Sequence>
      {/* faint silver bell glint in the black */}
      <div style={{position: 'absolute', left: 930, top: 520, width: 60, height: 60, borderRadius: '50%', background: 'radial-gradient(circle, rgba(230,240,255,0.9), rgba(180,200,240,0) 70%)', opacity: bellPulse * 0.9, transform: `scale(${1 + bellPulse * 2})`}} />
      {f >= TITLE_START && f < 236 && (
        <AbsoluteFill style={{opacity: titleOut}}>
          <AbsoluteFill style={{background: `radial-gradient(ellipse 1100px 420px at 960px 500px, rgba(120,150,220,${0.25 * glow}), rgba(0,0,0,0) 70%)`}} />
          <Fog y={560} opacity={0.35 * (0.4 + glow)} seed={17} speed={0.5} count={10} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 360, filter: `drop-shadow(0 0 ${30 * glow}px rgba(150,180,255,0.55))`}}>
            <Word text="FRAIDY" start={TITLE_START} size={210} />
            <div style={{height: 10}} />
            <Word text="CATS" start={TITLE_START + 34} size={210} />
          </div>
          {/* light sweep */}
          <div style={{position: 'absolute', left: shine, top: 320, width: 160, height: 520, transform: 'skewX(-20deg)', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))', mixBlendMode: 'overlay', filter: 'blur(14px)'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 815, textAlign: 'center', fontFamily: SERIF, fontSize: 36, color: '#aab6d0', opacity: tag,
            letterSpacing: `${tagLetter}em`, textShadow: '0 0 18px rgba(130,160,230,0.5)'}}>
            SOME DOORS SHOULD NEVER BE OPENED.
          </div>
          <div style={{position: 'absolute', left: 700, right: 700, top: 780, height: 2, background: 'linear-gradient(90deg, rgba(160,180,220,0), rgba(160,180,220,0.8), rgba(160,180,220,0))', opacity: tag, transform: `scaleX(${tag})`}} />
          <Dust count={40} color="190,210,255" opacity={0.6} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: '#cfe0ff', opacity: flash, mixBlendMode: 'screen'}} />
      {/* last glimpse: two glowing eyes in the upstairs window */}
      {houseIn && f < 290 && (
        <AbsoluteFill style={{background: NIGHT_SKY, transform: `scale(${push})`, transformOrigin: '1200px 520px'}}>
          <Stars h={500} /><Moon x={400} y={200} r={90} />
          <Treeline seed={4} color="#0b1530" width={2400} height={640} count={34} minH={260} maxH={480} style={{position: 'absolute', left: -240, top: 470}} />
          <div style={{position: 'absolute', left: 560, top: 230}}><House frame={f} upstairsFlicker={false} eyes={eyes} windowGlow={0.5} /></div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 830, bottom: -300, background: 'linear-gradient(#0b1424,#04070d)'}} />
          <Fog y={800} opacity={0.5} seed={2} speed={0.8} count={12} />
        </AbsoluteFill>
      )}
      <FilmLook vignette={0.9} />
      <LetterBox />
    </AbsoluteFill>
  );
};
