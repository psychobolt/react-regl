// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';
import mat4 from 'gl-mat4';

const { Drawable } = ReactRegl;

export function createModelMatrix(
  { translate, scale: s }: { translate: number[], scale: number[] },
) {
  const m = mat4.identity([]);
  mat4.translate(m, m, translate);
  mat4.scale(m, m, [s, s, s]);
  return m;
}

const model = (_, props) => createModelMatrix(props);

const cull = { enable: true };

type Props = {
  elements: number[][],
  position: number[][],
  normal: number[][],
  color: number[],
  isRound: boolean,
};

export default ({ color, isRound = false, elements, position, normal, ...props }: Props) => (
  <Drawable
    uniforms={{
      model,
      ambientLightAmount: 0.3,
      diffuseLightAmount: 0.7,
      color,
      isRound,
    }}
    attributes={{
      position,
      normal,
    }}
    elements={elements}
    cull={cull}
    {...(props: $Rest<Props, any>)}
  />
);
