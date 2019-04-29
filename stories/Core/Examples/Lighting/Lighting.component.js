import React from 'react';
import { ReglContainer, Frame, Drawable } from '@psychobolt/react-regl';
import mat4 from 'gl-mat4';
import normals from 'angle-normals';
import bunny from 'bunny';

import vert from './Lighting.vert';
import frag from './Lighting.frag';

const attributes = {
  position: bunny.positions,
  normal: normals(bunny.cells, bunny.positions),
};

const uniforms = {
  view: ({ tick }) => {
    const t = 0.01 * tick;
    return mat4.lookAt(
      [],
      [30 * Math.cos(t), 2.5, 30 * Math.sin(t)],
      [0, 2.5, 0],
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
  'lights[0].color': [1, 0, 0],
  'lights[1].color': [0, 1, 0],
  'lights[2].color': [0, 0, 1],
  'lights[3].color': [1, 1, 0],
  'lights[0].position': ({ tick }) => {
    const t = 0.1 * tick;
    return [
      10 * Math.cos(0.09 * (t)),
      10 * Math.sin(0.09 * (2 * t)),
      10 * Math.cos(0.09 * (3 * t)),
    ];
  },
  'lights[1].position': ({ tick }) => {
    const t = 0.1 * tick;
    return [
      10 * Math.cos(0.05 * (5 * t + 1)),
      10 * Math.sin(0.05 * (4 * t)),
      10 * Math.cos(0.05 * (0.1 * t)),
    ];
  },
  'lights[2].position': ({ tick }) => {
    const t = 0.1 * tick;
    return [
      10 * Math.cos(0.05 * (9 * t)),
      10 * Math.sin(0.05 * (0.25 * t)),
      10 * Math.cos(0.05 * (4 * t)),
    ];
  },
  'lights[3].position': ({ tick }) => {
    const t = 0.1 * tick;
    return [
      10 * Math.cos(0.1 * (0.3 * t)),
      10 * Math.sin(0.1 * (2.1 * t)),
      10 * Math.cos(0.1 * (1.3 * t)),
    ];
  },
};

const clear = ({ regl }) => regl.clear({
  depth: 1,
  color: [0, 0, 0, 1],
});

export default () => (
  <ReglContainer>
    <Frame onFrame={clear}>
      <Drawable
        vert={vert}
        frag={frag}
        attributes={attributes}
        elements={bunny.cells}
        uniforms={uniforms}
      />
    </Frame>
  </ReglContainer>
);
