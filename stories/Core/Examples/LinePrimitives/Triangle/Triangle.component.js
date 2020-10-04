// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

import { getPosition } from '../utils';

const { Drawable } = ReactRegl;

type Props = {
  lineWidth: number,
}

const N = 3;

export default (({ lineWidth }: Props) => (
  <Drawable
    uniforms={{
      color: [0.2, 0.8, 0.3],
      scale: 0.25,
      offset: [-0.7, 0.7],
      phase: 0.8,
      freq: -0.014,
    }}
    attributes={{
      position: getPosition(N),
    }}
    lineWidth={lineWidth}
    count={N}
    primitive="line loop"
  />
): React.AbstractComponent<Props>);
