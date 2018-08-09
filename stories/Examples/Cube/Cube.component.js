import React from 'react';
import mat4 from 'gl-mat4';

import { ReglContainer, Context, Resource, Frame, Drawable } from 'src';

import frag from './Cube.frag';
import vert from './Cube.vert';
import peppers from './peppers.png';

/* eslint-disable max-len */
const cubePosition = [
  [-0.5, +0.5, +0.5], [+0.5, +0.5, +0.5], [+0.5, -0.5, +0.5], [-0.5, -0.5, +0.5], // positive z face.
  [+0.5, +0.5, +0.5], [+0.5, +0.5, -0.5], [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5], // positive x face
  [+0.5, +0.5, -0.5], [-0.5, +0.5, -0.5], [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5], // negative z face
  [-0.5, +0.5, -0.5], [-0.5, +0.5, +0.5], [-0.5, -0.5, +0.5], [-0.5, -0.5, -0.5], // negative x face.
  [-0.5, +0.5, -0.5], [+0.5, +0.5, -0.5], [+0.5, +0.5, +0.5], [-0.5, +0.5, +0.5], // top face
  [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5], [-0.5, -0.5, +0.5], // bottom face
];
/* eslint-enable max-lin */

const cubeUv = [
  [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // positive z face.
  [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // positive x face.
  [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // negative z face.
  [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // negative x face.
  [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // top face
  [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // bottom face
];

const cubeElements = [
  [2, 1, 0], [2, 0, 3], // positive z face.
  [6, 5, 4], [6, 4, 7], // positive x face.
  [10, 9, 8], [10, 8, 11], // negative z face.
  [14, 13, 12], [14, 12, 15], // negative x face.
  [18, 17, 16], [18, 16, 19], // top face.
  [20, 21, 22], [23, 20, 22], // bottom face
];

const attributes = {
  position: cubePosition,
  uv: cubeUv,
};

const view = ({ tick }) => {
  const t = 0.01 * tick;
  return mat4.lookAt(
    [],
    [5 * Math.cos(t), 2.5 * Math.sin(t), 5 * Math.sin(t)],
    [0, 0.0, 0],
    [0, 1, 0],
  );
};

const projection = ({ viewportWidth, viewportHeight }) => mat4.perspective(
  [],
  Math.PI / 4,
  viewportWidth / viewportHeight,
  0.01,
  10,
);

const clear = ({ regl }) => regl.clear({
  color: [0, 0, 0, 255],
  depth: 1,
});

export default () => (
  <ReglContainer>
    <Frame onFrame={clear}>
      <Context.Consumer>
        {({ context }) => (
          <Resource
            manifest={{
              texture: {
                type: 'image',
                src: peppers,
                parser: data => context.regl.texture({
                  data,
                  mag: 'linear',
                  min: 'linear',
                }),
              },
            }}
          >
            {args => (
              <Drawable
                frag={frag}
                vert={vert}
                attributes={attributes}
                elements={cubeElements}
                uniforms={{
                  view,
                  projection,
                  tex: context.regl.prop('texture'),
                }}
                args={args}
              />
            )}
          </Resource>
        )}
      </Context.Consumer>
    </Frame>
  </ReglContainer>
);
