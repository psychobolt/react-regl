// @flow
import * as React from 'react';
import { Drawable } from '@psychobolt/react-regl';
import mat4 from 'gl-mat4';

function model(_, { scale: s, translate, yRotate }) {
  // we create the model matrix by combining
  // translation, scaling and rotation matrices.
  const m = mat4.identity([]);
  mat4.translate(m, m, translate);

  if (typeof s === 'number') {
    mat4.scale(m, m, [s, s, s]);
  } else { // else, we assume an array
    mat4.scale(m, m, s);
  }

  if (typeof yRotate !== 'undefined') {
    mat4.rotateY(m, m, yRotate);
  }

  return m;
}

const cull = {
  enable: true,
};

type Props = {
  elements: number[][],
  position: number[][],
  normal: number[][],
  color: number[],
};

export default ({ position, normal, elements, color, ...props }: Props) => (
  <Drawable
    uniforms={{
      model,
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
