// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

const { Drawable } = ReactRegl;

const uniforms = {
  yScale: -1.0,
};

const cull = {
  // must do this, since we mirrored the mesh.
  enable: true,
  face: 'front',
};

const stencil = {
  enable: true,
  mask: 0xff,
  func: {
    cmp: 'equal',
    ref: 1,
    mask: 0xff,
  },
};

type Props = {
  children: React.Node,
};

export default ({ children }: Props) => (
  <Drawable uniforms={uniforms} cull={cull} stencil={stencil}>
    {children}
  </Drawable>
);
