// @flow
import * as React from 'react';

import { Drawable } from '@psychobolt/react-regl';

const N = 20;
const n = 5.0;

type Props = {
  lineWidth: number,
};

export default ({ lineWidth }: Props) => (
  <Drawable
    uniforms={{
      color: [0.9, 0.2, 0.6],
      scale: 0.25,
      offset: [-0.7, -0.6],
      phase: 0.3,
      freq: -0.01,
    }}
    attributes={{
      position: Array(N).fill().map((_, i) => {
        const phi = -Math.PI * n + 2 * Math.PI * n * (i / N);
        const A = 0.5 * (i / N);
        return [A * Math.sin(phi), -1 + 2 * (i / N)];
      }),
    }}
    lineWidth={lineWidth}
    count={N}
    primitive="line strip"
  />
);
