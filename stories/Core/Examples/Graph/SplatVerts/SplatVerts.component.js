// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

import { VERTEX_COUNT } from '../constants';
import vert from './SplatVerts.vert';
import frag from './SplatVerts.frag';

const { Drawable } = ReactRegl;

type Props = {
  id: any,
  vertexState: any,
  args: {}
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

export default ({ id, vertexState, args }: Props) => (
  <Drawable
    vert={vert}
    frag={frag}
    attributes={{
      id,
    }}
    uniforms={{
      vertexState,
    }}
    blend={blend}
    depth={depth}
    primitive="points"
    count={VERTEX_COUNT}
    elements={null}
    args={args}
  />
);
