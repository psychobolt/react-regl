// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

import vert from './BlurPass.vert';
import frag from './BlurPass.frag';

import { FIELD_RES } from '../constants';

const { Drawable } = ReactRegl;

const attributes = {
  p: [-4, 0, 4, 4, 4, -4],
};

const depth = {
  enable: false,
  mask: false,
};

type Props = {
  framebuffer: any,
  src: any,
  axis: any,
};

export default ({ framebuffer, src, axis }: Props) => (
  <Drawable
    framebuffer={framebuffer}
    vert={vert}
    frag={frag}
    attributes={attributes}
    uniforms={{
      src,
      axis: () => {
        const result = [0, 0];
        result[axis] = 1.0 / FIELD_RES;
        return result;
      },
    }}
    depth={depth}
    count={3}
  />
);
