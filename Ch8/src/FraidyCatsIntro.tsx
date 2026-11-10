import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig} from 'remotion';
import {H, SCENES, TOTAL, W} from './theme';
import {Scene1House} from './scenes/Scene1House';
import {Scene2Note} from './scenes/Scene2Note';
import {Scene3JamieBrock} from './scenes/Scene3JamieBrock';
import {Scene4Midnight} from './scenes/Scene4Midnight';
import {Scene5Radio} from './scenes/Scene5Radio';
import {Scene6Felix} from './scenes/Scene6Felix';
import {Scene7Whiskers} from './scenes/Scene7Whiskers';
import {Scene8Title} from './scenes/Scene8Title';

/** Fits the 1920x1080 stage into whatever frame size is rendered (responsive). */
export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {width, height} = useVideoConfig();
  const s = Math.min(width / W, height / H);
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: (width - W * s) / 2, top: (height - H * s) / 2, width: W, height: H, transform: `scale(${s})`, transformOrigin: '0 0', overflow: 'hidden'}}>{children}</div>
    </AbsoluteFill>
  );
};

export const FraidyCatsIntro: React.FC = () => {
  const windVol = (f: number) => interpolate(f, [0, 60, 1470, 1620, 1800], [0, 0.55, 0.55, 0.3, 0.08], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Stage>
      <Audio src={staticFile('audio/music.wav')} volume={0.8} />
      <Audio src={staticFile('audio/wind.wav')} volume={windVol} />
      <Sequence from={SCENES.house.from} durationInFrames={SCENES.house.dur}><Scene1House /></Sequence>
      <Sequence from={SCENES.note.from} durationInFrames={SCENES.note.dur}><Scene2Note /></Sequence>
      <Sequence from={SCENES.jb.from} durationInFrames={SCENES.jb.dur}><Scene3JamieBrock /></Sequence>
      <Sequence from={SCENES.midnight.from} durationInFrames={SCENES.midnight.dur}><Scene4Midnight /></Sequence>
      <Sequence from={SCENES.radio.from} durationInFrames={SCENES.radio.dur}><Scene5Radio /></Sequence>
      <Sequence from={SCENES.felix.from} durationInFrames={SCENES.felix.dur}><Scene6Felix /></Sequence>
      <Sequence from={SCENES.whiskers.from} durationInFrames={SCENES.whiskers.dur}><Scene7Whiskers /></Sequence>
      <Sequence from={SCENES.title.from} durationInFrames={SCENES.title.dur}><Scene8Title /></Sequence>
    </Stage>
  );
};
export {TOTAL};
