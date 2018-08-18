// @flow
import * as React from 'react';

import { Drawable } from 'src';

import { getPosition } from '../LinePrimitives.component';

const N = 6;

type Props = {
  lineWidth: number
};

export default ({ lineWidth }: Props) => (
  <Drawable
    uniforms={{
      color: [0.7, 0.3, 0.9],
      scale: 0.25,
      offset: [0.0, 0.7],
      phase: 0.6,
      freq: 0.009,
    }}
    attributes={{
      position: getPosition(N),
    }}
    lineWidth={lineWidth}
    count={N}
    primitive="line loop"
  />
);
