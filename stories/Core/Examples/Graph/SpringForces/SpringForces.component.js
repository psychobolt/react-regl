// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

import vert from './SpringForces.vert';
import frag from './SpringForces.frag';

import { VERTEX_TEXTURE_SIZE, ARCS, vertexIndex } from '../constants';

const { Drawable } = ReactRegl;

const EDGE_LENGTH = 0.5 / VERTEX_TEXTURE_SIZE;
const EDGE_STIFFNESS = 0.08;

const attributes = {
  edge: ARCS.map(arc => {
    const ps = vertexIndex(arc[0]);
    const pt = vertexIndex(arc[1]);
    return [
      ps[0] / VERTEX_TEXTURE_SIZE,
      ps[1] / VERTEX_TEXTURE_SIZE,
      pt[0] / VERTEX_TEXTURE_SIZE,
      pt[1] / VERTEX_TEXTURE_SIZE,
    ];
  }),
};

const blend = {
  enable: true,
  func: {
    src: 1,
    dst: 1,
  },
  equation: 'add',
};

const depth = {
  enable: false,
  mask: false,
};

type Props = {
  framebuffer: any,
  vertexState: any,
  args: {}
}

export default ({ framebuffer, vertexState, args }: Props) => (
  <Drawable
    framebuffer={framebuffer}
    vert={vert}
    frag={frag}
    attributes={attributes}
    uniforms={{
      vertexState,
      restLength: EDGE_LENGTH,
      stiffness: EDGE_STIFFNESS,
      VERTEX_TEXTURE_SIZE,
    }}
    blend={blend}
    depth={depth}
    count={ARCS.length}
    primitive="points"
    args={args}
  />
);
