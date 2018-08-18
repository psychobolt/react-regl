// @flow
import * as React from 'react';

import { Drawable } from 'src';

const N = 120;

type Props = {
  lineWidth: number
};

export default ({ lineWidth }: Props) => (
  <Drawable
    uniforms={{
      color: [0.3, 0.8, 0.76],
      scale: 0.25,
      offset: [0.0, 0.0],
      phase: 0.6,
      freq: 0.015,
    }}
    attributes={{
      position: Array(N).fill().map((_, i) => {
        let phi = 2 * Math.PI * (i / N);
        phi *= 5.0;
        const A = 0.03;
        return [
          A * (Math.cos(phi) + phi * Math.sin(phi)),
          A * (Math.sin(phi) - phi * Math.cos(phi)),
        ];
      }),
    }}
    lineWidth={lineWidth}
    count={N}
    primitive="line strip"
  />
);
