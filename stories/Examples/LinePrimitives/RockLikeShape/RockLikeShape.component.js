// @flow
import * as React from 'react';
import seedrandom from 'seedrandom';

import { Drawable } from 'src';

const rng = seedrandom('my_seed');
const N = 70;

type Props = {
  lineWidth: number
};

export default ({ lineWidth }: Props) => (
  <Drawable
    uniforms={{
      color: [0.7, 0.8, 0.4],
      scale: 0.25,
      offset: [0.7, 0.0],
      phase: 0.6,
      freq: 0.012,
    }}
    attributes={{
      position: Array(N).fill().map((_, i) => {
        const phi = 2 * Math.PI * (i / N);
        const A = 1.0 + 0.15 * rng();
        return [A * Math.cos(phi), A * Math.sin(phi)];
      }),
    }}
    lineWidth={lineWidth}
    count={N}
    primitive="line loop"
  />
);
