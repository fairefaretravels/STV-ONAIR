import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Caption, Dust, FilmLook, Fog, LetterBox, Moon, NIGHT_SKY, SceneFade, Stars, handheld} from '../components/Atmos';
import {BareTree, House, Treeline} from '../components/Scenery';
import {SCENES} from '../theme';

const D = SCENES.house.dur;

/** Scene 1 — slow aerial push toward the abandoned house; one upstairs window flickers. */
export const Scene1House: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, D], [0, 1], {easing: Easing.inOut(Easing.sin)});
  const hh = handheld(f, 0.8);
  // "aerial": start high & tilted down, glide forward and settle at eye level
  const layer = (depth: number, baseY = 0) => ({
    transform: `translate(${hh.x * depth}px, ${baseY + (1 - p) * -260 * depth + hh.y}px) scale(${1 + p * 0.9 * depth}) rotate(${(1 - p) * -1.2 + hh.r}deg)`,
    transformOrigin: '960px 760px',
  } as React.CSSProperties);
  return (
    <SceneFade dur={D} inF={30} outF={10}>
      <Audio src={staticFile('audio/creak_branch.wav')} startFrom={0} volume={0.5} />
      <AbsoluteFill style={{background: NIGHT_SKY}}>
        <AbsoluteFill style={layer(0.15)}><Stars h={560} /><Moon x={1470} y={210} r={90} /></AbsoluteFill>
        {/* far trees */}
        <AbsoluteFill style={layer(0.35)}><Treeline seed={4} color="#0b1530" width={2400} height={640} count={34} minH={260} maxH={480} style={{position: 'absolute', left: -240, top: 520}} /></AbsoluteFill>
        <Fog y={640} opacity={0.35} seed={2} speed={0.4} count={8} />
        {/* house */}
        <AbsoluteFill style={layer(1)}>
          <div style={{position: 'absolute', left: 560, top: 260, width: 800, height: 700}}>
            <House frame={f} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 862, bottom: -300, background: 'linear-gradient(#0b1424, #04070d)'}} />
        </AbsoluteFill>
        {/* mid trees flanking the house */}
        <AbsoluteFill style={layer(1.25)}>
          <Treeline seed={9} color="#05080f" width={2600} height={760} count={20} minH={420} maxH={760} style={{position: 'absolute', left: -340, top: 330}} />
        </AbsoluteFill>
        <Fog y={800} opacity={0.5} seed={7} speed={0.9} count={14} />
        {/* foreground bare trees */}
        <AbsoluteFill style={layer(1.9)}>
          <BareTree seed={3} style={{position: 'absolute', left: -60, top: 0}} />
          <BareTree seed={8} flip style={{position: 'absolute', right: -80, top: 40}} />
        </AbsoluteFill>
        <Fog y={940} opacity={0.35} seed={11} speed={1.4} count={8} />
        <Dust count={40} color="190,210,255" opacity={0.5} />
      </AbsoluteFill>
      <Caption from={150} to={225} font="Georgia, serif" size={32} italic color="#9fb0d0">…the house had been empty for years.</Caption>
      <FilmLook />
      <LetterBox />
    </SceneFade>
  );
};
