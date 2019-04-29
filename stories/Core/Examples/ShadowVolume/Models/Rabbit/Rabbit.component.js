// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

import DATA from './shadow_bunny.json';
import vert from '../Models.vert';
import frag from '../Models.frag';

const { Drawable } = ReactRegl;

const DIFFUSE_COLOR_RABBIT = [0.7, 0.3, 0.3];
const AMBIENT_COLOR_RABBIT = [0.3, 0.2, 0.3];

const model = (_, props) => props.model;

type Props = {
  buffer: any,
  intensity: number,
};

export default ({ buffer, intensity, ...props }: Props) => (
  <Drawable
    vert={vert}
    frag={frag}
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
      ambient: AMBIENT_COLOR_RABBIT,
      diffuse: [
        intensity * DIFFUSE_COLOR_RABBIT[0],
        intensity * DIFFUSE_COLOR_RABBIT[1],
        intensity * DIFFUSE_COLOR_RABBIT[2],
      ],
      model,
    }}
    count={DATA.MESH.length / 6}
    {...props}
  />
);
