// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

import frag from './Pass.frag';
import vert from './Pass.vert';

const { Drawable } = ReactRegl;

const attributes = {
  position: [-2, 0, 0, -2, 2, 2],
};

type Props = {
  tex: any,
  rcpDim: number,
  framebuffer: any
};

export default ({ tex, rcpDim, framebuffer, ...props }: Props) => (
  <Drawable
    frag={frag}
    vert={vert}
    attributes={attributes}
    uniforms={{
      tex,
      rcpDim,
    }}
    framebuffer={framebuffer}
    count={3}
    {...(props: $Rest<Props, any>)}
  />
);
