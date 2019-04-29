import React from 'react';
import { ReglContainer, Frame, Context, Drawable } from '@psychobolt/react-regl';
import mat4 from 'gl-mat4';
import hsv2rgb from 'hsv2rgb';

import vert from './Particles.vert';
import frag from './Particles.frag';

const NUM_POINTS = 1e4;
const VERT_SIZE = 4 * (4 + 4 + 3);

let pointBuffer;

const onMount = ({ regl }) => {
  pointBuffer = regl.buffer(Array(NUM_POINTS).fill().map(() => {
    const color = hsv2rgb(Math.random() * 360, 0.6, 1);
    return [
      // freq
      Math.random() * 10,
      Math.random() * 10,
      Math.random() * 10,
      Math.random() * 10,
      // phase
      2.0 * Math.PI * Math.random(),
      2.0 * Math.PI * Math.random(),
      2.0 * Math.PI * Math.random(),
      2.0 * Math.PI * Math.random(),
      // color
      color[0] / 255, color[1] / 255, color[2] / 255,
    ];
  }));
};

const uniforms = {
  view: ({ tick }) => {
    const t = 0.01 * tick;
    return mat4.lookAt(
      [],
      [30 * Math.cos(t), 2.5, 30 * Math.sin(t)],
      [0, 0, 0],
      [0, 1, 0],
    );
  },
  projection: ({ viewportWidth, viewportHeight }) => mat4.perspective(
    [],
    Math.PI / 4,
    viewportWidth / viewportHeight,
    0.01,
    1000,
  ),
  time: ({ tick }) => tick * 0.001,
};

const clear = ({ regl }) => regl.clear({
  depth: 1,
  color: [0, 0, 0, 1],
});

export default () => (
  <ReglContainer onMount={onMount}>
    <Frame onFrame={clear}>
      <Context.Consumer>
        {() => (
          <Drawable
            vert={vert}
            frag={frag}
            attributes={{
              freq: {
                buffer: pointBuffer,
                stride: VERT_SIZE,
                offset: 0,
              },
              phase: {
                buffer: pointBuffer,
                stride: VERT_SIZE,
                offset: 16,
              },
              color: {
                buffer: pointBuffer,
                stride: VERT_SIZE,
                offset: 32,
              },
            }}
            uniforms={uniforms}
            count={NUM_POINTS}
            primitive="points"
          />
        )}
      </Context.Consumer>
    </Frame>
  </ReglContainer>
);
