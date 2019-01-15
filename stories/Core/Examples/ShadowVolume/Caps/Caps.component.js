// @flow
import * as React from 'react';
import { Drawable } from '@psychobolt/react-regl';

import vert from './Caps.vert';
import DATA from '../Models/Rabbit/shadow_bunny.json';

const model = (_, props) => props.model;

type Props = {
  buffer: any,
  model: any,
};

export default ({ buffer, ...props }: Props) => (
  <Drawable
    vert={vert}
    attributes={{
      position: {
        buffer,
        offset: 0,
        normalized: false,
        stride: 24,
        size: 3,
      },
      normal: {
        buffer,
        offset: 12,
        normalized: false,
        stride: 24,
        size: 3,
      },
    }}
    uniforms={{
      model,
    }}
    count={DATA.MESH.length / 6}
    {...props}
  />
);
