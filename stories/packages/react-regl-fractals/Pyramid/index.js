import React from 'react';

import { ReglContainer, Frame } from '@psychobolt/react-regl';
import { Pyramid } from '@psychobolt/react-regl-fractals';
import Readme from 'packages/react-regl-fractals/src/Pyramid/README.md';

import { withKnobs } from '../shared';

const clear = ({ regl }) => regl.clear({
  color: [1, 1, 1, 1],
  depth: 1,
});

export const README = Readme;

export default () => (
  <ReglContainer onMount={clear}>
    <Frame onFrame={clear}>
      {withKnobs(Pyramid)}
    </Frame>
  </ReglContainer>
);
