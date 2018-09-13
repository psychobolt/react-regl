// @flow
import React from 'react';

import { Drawable } from '@psychobolt/react-regl';

type Props = {
  lineWidth: number
};

export default ({ lineWidth }: Props) => (
  <Drawable
    uniforms={{
      color: [1, 0.1, 0.3],
      scale: 0.25,
      offset: [-0.7, 0.0],
      phase: 0.0,
      freq: 0.01,
    }}
    attributes={{
      position: [[-1, -1], [1, -1], [1, 1], [-1, 1]],
    }}
    lineWidth={lineWidth}
    count={4}
    primitive="line loop"
  />
);
