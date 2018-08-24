import React from 'react';

import { ReglContainer, Drawable } from 'src';

import frag from './Scope.frag';
import vert from './Scope.vert';

const clear = ({ regl }) => regl.clear({
  color: [0, 0, 0, 1],
  depth: 1,
});

const attributes = {
  position: [
    0.5, 0,
    0, 0.5,
    1, 1,
  ],
};

const shapes = [
  {
    key: 'red',
    uniforms: {
      color: [1, 0, 0, 1],
      offset: [0, 0],
    },
  },
  {
    key: 'blue',
    uniforms: {
      color: [0, 0, 1, 1],
      offset: [-1, 0],
    },
  },
  {
    key: 'green',
    uniforms: {
      color: [0, 1, 0, 1],
      offset: [0, -1],
    },
  },
  {
    key: 'white',
    uniforms: {
      color: [1, 1, 1, 1],
      offset: [-1, -1],
    },
  },
];

export default () => (
  <ReglContainer onMount={clear}>
    <Drawable
      frag={frag}
      vert={vert}
      attributes={attributes}
      count={3}
    >
      {shapes.map(({ key, uniforms }) => <Drawable key={key} uniforms={uniforms} />)}
    </Drawable>
  </ReglContainer>
);
