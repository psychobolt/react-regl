// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

const { Drawable } = ReactRegl;

const N = 70;
const n = 5.0;

type Props = {
  lineWidth: number
};

export default ({ lineWidth }: Props) => (
  <Drawable
    uniforms={{
      color: [1, 0.7, 0.2],
      scale: 0.25,
      offset: [0.0, -0.6],
      phase: 0.6,
      freq: 0.015,
    }}
    attributes={{
      position: Array(N).fill().map((_, i) => {
        const phi = -Math.PI * n + 2 * Math.PI * n * (i / N);
        const A = 0.5;
        return [A * Math.sin(phi), -(0.9) + 1.8 * (i / N)];
      }),
    }}
    lineWidth={lineWidth}
    count={N}
    primitive="line strip"
  />
);
