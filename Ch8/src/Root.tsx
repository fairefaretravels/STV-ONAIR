import React from 'react';
import {Composition} from 'remotion';
import {FraidyCatsIntro, Stage} from './FraidyCatsIntro';
import {FPS, H, SCENES, TOTAL, W} from './theme';
import {Scene1House} from './scenes/Scene1House';
import {Scene2Note} from './scenes/Scene2Note';
import {Scene3JamieBrock} from './scenes/Scene3JamieBrock';
import {Scene4Midnight} from './scenes/Scene4Midnight';
import {Scene5Radio} from './scenes/Scene5Radio';
import {Scene6Felix} from './scenes/Scene6Felix';
import {Scene7Whiskers} from './scenes/Scene7Whiskers';
import {Scene8Title} from './scenes/Scene8Title';

const wrap = (C: React.FC) => () => <Stage><C /></Stage>;
const singles = [
  ['Scene1-House', Scene1House, SCENES.house.dur],
  ['Scene2-Note', Scene2Note, SCENES.note.dur],
  ['Scene3-JamieAndBrock', Scene3JamieBrock, SCENES.jb.dur],
  ['Scene4-Midnight', Scene4Midnight, SCENES.midnight.dur],
  ['Scene5-Radio', Scene5Radio, SCENES.radio.dur],
  ['Scene6-Felix', Scene6Felix, SCENES.felix.dur],
  ['Scene7-Whiskers', Scene7Whiskers, SCENES.whiskers.dur],
  ['Scene8-Title', Scene8Title, SCENES.title.dur],
] as const;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="FraidyCatsIntro" component={FraidyCatsIntro} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
    {singles.map(([id, C, d]) => (
      <Composition key={id} id={id} component={wrap(C as React.FC)} durationInFrames={d} fps={FPS} width={W} height={H} />
    ))}
  </>
);
