// @flow
import * as React from 'react';
import { Drawable } from '@psychobolt/react-regl';

import vert from '../Models.vert';
import frag from '../Models.frag';

const DIFFUSE_COLOR_PLANE = [0.7, 0.7, 0.7];
const AMBIENT_COLOR_PLANE = [0.3, 0.3, 0.3];

const planeElements = [
  [3, 1, 0],
  [0, 2, 3],
];

const s = 10.0;
const y = 0.0;
const planePosition = [
  [-s, y, -s],
  [+s, y, -s],
  [-s, y, +s],
  [+s, y, +s],
];

const planeNormal = [
  [0.0, 1.0, 0.0],
  [0.0, 1.0, 0.0],
  [0.0, 1.0, 0.0],
  [0.0, 1.0, 0.0],
];

const attributes = {
  position: planePosition,
  normal: planeNormal,
};

const cull = {
  enable: true,
};

type Props = {
  intensity: number,
  model: any
};

export default ({ intensity, model, ...props }: Props) => (
  <Drawable
    vert={vert}
    frag={frag}
    uniforms={{
      ambient: AMBIENT_COLOR_PLANE,
      diffuse: [
        intensity * DIFFUSE_COLOR_PLANE[0],
        intensity * DIFFUSE_COLOR_PLANE[1],
        intensity * DIFFUSE_COLOR_PLANE[2],
      ],
      model,
    }}
    attributes={attributes}
    elements={planeElements}
    cull={cull}
    {...props}
  />
);
