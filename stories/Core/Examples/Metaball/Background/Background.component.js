// @flow
import * as React from 'react';
import { Drawable } from '@psychobolt/react-regl';

import vert from './Background.vert';
import frag from './Background.frag';

type Props = {
  width: any,
  height: any,
};

const color = [36 / 255.0, 70 / 255.0, 106 / 255.0];

const attributes = {
  position: [-4, -4, 4, -4, 0, 4],
};

const args = {
  depth: {
    enable: false,
    mask: false,
  },
};

export default ({ width, height }: Props) => (
  <Drawable
    vert={vert}
    frag={frag}
    uniforms={{
      color,
      width,
      height,
      noise: 0.05,
    }}
    attributes={attributes}
    count={3}
    args={args}
  />
);
