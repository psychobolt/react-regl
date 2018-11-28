// @flow
import * as React from 'react';
import { Drawable } from '@psychobolt/react-regl';

const cull = {
  enable: true,
};

type Props = {
  elements: number[][],
  position: number[][],
  normal: number[][],
  color: number[][],
  model: number[],
};

export default ({ elements, position, normal, color, model }: Props) => (
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
  />
);
