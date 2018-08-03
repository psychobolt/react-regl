import React from 'react';
import mat4 from 'gl-mat4';
import bunny from 'bunny';

import { ReglContainer, Frame, Drawable } from 'dist';

import vert from './Bunny.vert';
import frag from './Bunny.frag';

const attributes = {
  position: bunny.positions,
};

const uniforms = {
  model: mat4.identity([]),
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
