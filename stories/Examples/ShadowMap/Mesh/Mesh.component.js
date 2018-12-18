// @flow
import * as React from 'react';
import { Drawable } from '@psychobolt/react-regl';
import mat4 from 'gl-mat4';

function model(_, { translate, scale: s }) {
  const m = mat4.identity([]);
  mat4.translate(m, m, translate);
  mat4.scale(m, m, [s, s, s]);
  return m;
}

const cull = {
  enable: true,
};

type Props = {
  color: number[],
  position: number[][],
  normal: number[][],
  elements: number[][]
};

export default ({ color, position, normal, elements, ...props }: Props) => (
  <Drawable
    uniforms={{
      model,
      ambientLightAmount: 0.3,
      diffuseLightAmount: 0.7,
      color,
    }}
    attributes={{
      position,
      normal,
    }}
    elements={elements}
    cull={cull}
    {...props}
  />
);
