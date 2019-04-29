// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

const { Drawable } = ReactRegl;

const N = 300;
const A = 1.0;
const n = 5.0;
const d = 4.0;
const k = n / d;

type Props = {
  lineWidth: number;
};

export default ({ lineWidth }: Props) => (
  <Drawable
    uniforms={{
      color: [1.0, 1.0, 1.0],
      scale: 0.25,
      offset: [0.7, -0.6],
      phase: 0.6,
      freq: -0.011,
    }}
    attributes={{
      position: Array(N).fill().map((_, i) => {
        let phi = 2 * Math.PI * (i / N);
        phi *= 5.0;
        return [
          A * (Math.cos(k * phi) * Math.cos(phi)),
          A * (Math.cos(k * phi) * Math.sin(phi)),
        ];
      }),
    }}
    lineWidth={lineWidth}
    count={N}
    primitive="line strip"
  />
);
