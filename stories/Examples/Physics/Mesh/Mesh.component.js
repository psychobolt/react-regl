// @flow
import * as React from 'react';
import { Drawable } from '@psychobolt/react-regl';

import { getModelMatrix } from '../ammo';

const model = (_, props) => props.model;

const cull = {
  enable: true,
};

type Props = {
  elements: number[][],
  position: number[][],
  normal: number[][],
  color: number[][],
  rigidBody: any,
};

export default ({ elements, position, normal, color, rigidBody }: Props) => (
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
    args={() => ({ model: getModelMatrix(rigidBody) })}
  />
);
