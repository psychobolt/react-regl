// @flow
import * as React from 'react';
import { Drawable } from '@psychobolt/react-regl';

import frag from './Verts.frag';
import vert from './Verts.vert';

const DT = 0.0001;
const DAMPING = 0.98;
const FIELD_STRENGTH = 0.05;

const attributes = {
  p: [-4, 0, 4, -4, 4, 4],
};

type Props = {
  framebuffer: any,
  vertexState: any,
  field: any,
  tick: any,
  args: {},
};

const temperature = ({ tick }) => 1.0 / (0.5 * tick + 20.0);

export default ({ framebuffer, vertexState, field, tick: t, args }: Props) => (
  <Drawable
    framebuffer={framebuffer}
    frag={frag}
    vert={vert}
    attributes={attributes}
    uniforms={{
      vertexState,
      field,
      temperature,
      t,
      DT,
      DAMPING,
      FIELD_STRENGTH,
    }}
    count={3}
    args={args}
  />
);
