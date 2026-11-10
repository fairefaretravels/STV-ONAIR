import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Dust, FilmLook, Fog, LetterBox, Moon, NIGHT_SKY, SceneFade, Stars, handheld} from '../components/Atmos';
import {BareTree, House, Treeline} from '../components/Scenery';
import {SCENES, flicker} from '../theme';

const D = SCENES.jb.dur;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Beam: React.FC<{x: number; y: number; angle: number; len?: number; w?: number; o?: number}> = ({x, y, angle, len = 900, w = 300, o = 0.55}) => (
  <div style={{position: 'absolute', left: x, top: y, width: len, height: w, transformOrigin: '0 50%', transform: `translateY(${-w / 2}px) rotate(${angle}deg)`,
    background: `linear-gradient(90deg, rgba(235,245,255,${o}) 0%, rgba(200,225,255,${o * 0.35}) 55%, rgba(200,225,255,0) 100%)`,
    clipPath: 'polygon(0 46%, 100% 0, 100% 100%, 0 54%)', filter: 'blur(10px)', mixBlendMode: 'screen'}} />
);

/** Walking-away shot (uses the supplied model-sheet back views of Brock & Jamie). */
const ShotApproach: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const hh = handheld(f, 1);
  const walk = interpolate(f, [0, dur], [0, 1]);
  const bob = (o: number) => Math.abs(Math.sin(f / 5.2 + o)) * -9;
  const sc = interpolate(walk, [0, 1], [3.5, 3.05]);
  return (
    <AbsoluteFill style={{background: NIGHT_SKY}}>
      <Stars h={500} /><Moon x={400} y={190} r={80} />
      <AbsoluteFill style={{transform: `scale(${1 + walk * 0.35}) translate(${hh.x}px,${hh.y}px)`, transformOrigin: '960px 700px'}}>
        <Treeline seed={5} color="#0b1530" width={2400} height={640} count={34} minH={260} maxH={480} style={{position: 'absolute', left: -240, top: 470}} />
        <div style={{position: 'absolute', left: 660, top: 250, transform: 'scale(0.75)', transformOrigin: '50% 100%'}}><House frame={f} windowGlow={0.8} /></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 760, bottom: 0, background: 'linear-gradient(#0c1526, #04060c)'}} />
        <Treeline seed={12} color="#05080f" width={2600} height={760} count={18} minH={420} maxH={780} style={{position: 'absolute', left: -340, top: 250}} />
      </AbsoluteFill>
      <Fog y={720} opacity={0.5} seed={6} speed={1} count={12} />
      {/* flashlight beams reaching toward the house */}
      <Beam x={870} y={760} angle={-24} len={760} w={260} o={0.5} />
      <Beam x={1010} y={760} angle={-14} len={820} w={280} o={0.5} />
      {/* Brock & Jamie from behind */}
      <div style={{position: 'absolute', left: 585, bottom: 0, width: 700, height: 600, transformOrigin: '50% 100%', transform: `scale(${sc / 3.5})`}}>
        <Img src={staticFile('art/brock_back.png')} style={{position: 'absolute', left: 150, bottom: bob(0), height: 560, filter: 'brightness(0.78) saturate(0.9) contrast(1.05) blur(0.5px)',
          WebkitMaskImage: 'radial-gradient(ellipse 52% 56% at 50% 50%, #000 62%, transparent 100%)'}} />
        <Img src={staticFile('art/jamie_back.png')} style={{position: 'absolute', left: 390, bottom: bob(2.4), height: 575, filter: 'brightness(0.78) saturate(0.95) contrast(1.05) blur(0.5px)',
          WebkitMaskImage: 'radial-gradient(ellipse 52% 56% at 50% 50%, #000 62%, transparent 100%)'}} />
      </div>
      <Fog y={900} opacity={0.4} seed={13} speed={1.6} count={8} />
      <BareTree seed={6} style={{position: 'absolute', left: -90, top: 20}} />
      <BareTree seed={5} flip style={{position: 'absolute', right: -110, top: 60}} />
      <Dust count={40} color="190,210,255" opacity={0.5} />
    </AbsoluteFill>
  );
};

/** Face close-up from the model sheet (curiosity mixed with fear). */
const ShotFace: React.FC<{who: 'brock' | 'jamie'; dur: number}> = ({who, dur}) => {
  const f = useCurrentFrame();
  const hh = handheld(f, 1.4);
  const z = interpolate(f, [0, dur], [1, 1.22], {easing: Easing.out(Easing.quad)});
  const sweep = interpolate(f, [0, dur], [-40, 30]);
  const brock = who === 'brock';
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #16233f 0%, #070b16 75%)'}}>
      <Fog y={700} opacity={0.35} seed={21} speed={0.8} count={8} />
      {/* underlit by flashlight */}
      <AbsoluteFill style={{background: `radial-gradient(ellipse 600px 520px at ${brock ? 1150 : 760}px 880px, rgba(230,240,255,0.30), rgba(0,0,0,0) 70%)`}} />
      <div style={{position: 'absolute', left: brock ? 520 : 560, top: brock ? -60 : -80, width: 880, height: 1500, transformOrigin: '50% 12%',
        transform: `translate(${hh.x + sweep * 0.3}px, ${hh.y}px) scale(${z}) rotate(${hh.r + (brock ? -1 : 1)}deg)`}}>
        <Img src={staticFile(brock ? 'art/brock_full.png' : 'art/jamie_full.png')} style={{width: '100%', height: 'auto', filter: 'brightness(0.95) contrast(1.08) saturate(1.0) blur(0.7px)',
          WebkitMaskImage: 'radial-gradient(ellipse 62% 58% at 50% 42%, #000 55%, transparent 100%)'}} />
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,8,20,0.55), rgba(0,0,0,0) 40%, rgba(5,8,20,0.5))'}} />
      <Dust count={30} color="200,220,255" opacity={0.6} />
    </AbsoluteFill>
  );
};

/** The front door opens by itself. */
const ShotDoor: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const hh = handheld(f, 0.7);
  const open = interpolate(f, [30, 80], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const push = interpolate(f, [0, dur], [1.9, 3.0], {easing: Easing.inOut(Easing.quad)});
  const shake = f > 28 && f < 70 ? Math.sin(f * 3.1) * 1.5 : 0;
  return (
    <AbsoluteFill style={{background: NIGHT_SKY}}>
      <AbsoluteFill style={{transform: `scale(${push}) translate(${hh.x + shake}px, ${hh.y}px)`, transformOrigin: '960px 640px'}}>
        <Treeline seed={5} color="#0b1530" width={2400} height={640} count={34} minH={260} maxH={480} style={{position: 'absolute', left: -240, top: 450}} />
        <div style={{position: 'absolute', left: 560, top: 200}}><House frame={f} doorOpen={open} windowGlow={0.8 + 0.3 * open} /></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 800, bottom: -600, background: 'linear-gradient(#0c1526, #04060c)'}} />
      </AbsoluteFill>
      <Fog y={760} opacity={0.45} seed={31} speed={0.7} count={10} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 500px 420px at 960px 620px, rgba(255,170,90,${0.25 * open}), rgba(0,0,0,0) 70%)`, mixBlendMode: 'screen'}} />
      {/* the two silhouettes frozen at the foot of the steps */}
      <div style={{position: 'absolute', left: 700, bottom: -30, width: 520, height: 400, opacity: 0.95}}>
        <Img src={staticFile('art/brock_back.png')} style={{position: 'absolute', left: 50, bottom: 0, height: 380, filter: 'brightness(0.35) blur(0.6px)', WebkitMaskImage: 'radial-gradient(ellipse 52% 56% at 50% 50%, #000 62%, transparent 100%)'}} />
        <Img src={staticFile('art/jamie_back.png')} style={{position: 'absolute', left: 270, bottom: 0, height: 390, filter: 'brightness(0.35) blur(0.6px)', WebkitMaskImage: 'radial-gradient(ellipse 52% 56% at 50% 50%, #000 62%, transparent 100%)'}} />
      </div>
      <Dust count={30} color="255,210,160" opacity={0.6} />
    </AbsoluteFill>
  );
};

/** Scene 3 — Jamie and Brock approach; the door opens by itself. */
export const Scene3JamieBrock: React.FC = () => {
  const f = useCurrentFrame();
  const flash = flicker(f, 8, 0.1);
  return (
    <SceneFade dur={D} inF={8} outF={6}>
      <Audio src={staticFile('audio/footsteps.wav')} volume={0.7} />
      <Sequence from={225}><Audio src={staticFile('audio/door.wav')} volume={0.95} /></Sequence>
      <Sequence from={0} durationInFrames={110}><ShotApproach dur={110} /></Sequence>
      <Sequence from={110} durationInFrames={50}><ShotFace who="brock" dur={50} /></Sequence>
      <Sequence from={160} durationInFrames={50}><ShotFace who="jamie" dur={50} /></Sequence>
      <Sequence from={210} durationInFrames={90}><ShotDoor dur={90} /></Sequence>
      <FilmLook grain={0.12 * (0.8 + flash * 0.4)} />
      <LetterBox />
    </SceneFade>
  );
};
