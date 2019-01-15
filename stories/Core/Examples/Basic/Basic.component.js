import React from 'react';

import { ReglContainer, Drawable } from '@psychobolt/react-regl';

import frag from './Basic.frag';
import vert from './Basic.vert';

const clear = ({ regl }) => regl.clear({
  color: [0, 0, 0, 1],
  depth: 1,
});

const attributes = {
  position: [[-1, 0], [0, -1], [1, 1]],
};

const uniforms = {
  color: [1, 0, 0, 1],
};

export default () => (
  <ReglContainer onMount={clear}>
    <Drawable
      frag={frag}
      vert={vert}
      attributes={attributes}
      uniforms={uniforms}
      count={3}
    />
  </ReglContainer>
);
