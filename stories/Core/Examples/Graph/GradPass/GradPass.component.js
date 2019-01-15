// @flow
import * as React from 'react';
import { Drawable } from '@psychobolt/react-regl';

import vert from './GradPass.vert';
import frag from './GradPass.frag';

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
};

export default ({ framebuffer, src }: Props) => (
  <Drawable
    framebuffer={framebuffer}
    vert={vert}
    frag={frag}
    attributes={attributes}
    uniforms={{
      src,
      deriv: () => [1 / src.width, 1 / src.height],
    }}
    depth={depth}
    count={3}
  />
);
