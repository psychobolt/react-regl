// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

const { Drawable } = ReactRegl;

const N = 30;

type Props = {
  lineWidth: number
}

export default ({ lineWidth }: Props) => (
  <Drawable
    uniforms={{
      color: [0.3, 0.6, 0.8],
      scale: 0.25,
      offset: [0.7, 0.7],
      phase: 0.6,
      freq: -0.011,
    }}
    attributes={{
      position: Array(N).fill().map((_, i) => {
        const phi = 2 * Math.PI * (i / N);
        const A = 1.0 + 0.15 * Math.sin(phi * 70.0);
        return [A * Math.cos(phi), A * Math.sin(phi)];
      }),
    }}
    lineWidth={lineWidth}
    count={N}
    primitive="line loop"
  />
);
