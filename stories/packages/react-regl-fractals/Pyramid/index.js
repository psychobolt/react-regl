// @flow
import * as React from 'react';

import { ReglContainer, Frame } from '@psychobolt/react-regl';
import { Pyramid } from '@psychobolt/react-regl-fractals';

export { default as MDX } from 'packages/react-regl-fractals/src/Pyramid/README.md';

const clear = ({ regl }) => regl.clear({
  color: [1, 1, 1, 1],
  depth: 1,
});

type Props = {
  degree: Number,
};

export default (({ degree }: Props) => (
  <ReglContainer onMount={clear}>
    <Frame onFrame={clear}>
      <Pyramid degree={degree} />
    </Frame>
  </ReglContainer>
): React.AbstractComponent<Props>);
