// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';
import mat4 from 'gl-mat4';

const { Drawable } = ReactRegl;

const model = (_, { translate, scale: s }) => {
  const m = mat4.identity([]);

  if (typeof translate !== 'undefined') {
    mat4.translate(m, m, translate);
  }

  mat4.scale(m, m, [s, s, s]);
  return m;
};

const alpha = (_, props) => {
  if (typeof props.alpha !== 'undefined') {
    return props.alpha;
  }
  return 1.0;
};

const cull = {
  enable: true,
};

type Props = {
  color: number[],
  position: number[],
  normal: number[],
  elements: number[][],
  args: {}
};

export default (({ color, position, normal, elements, args }: Props) => (
  <Drawable
    uniforms={{
      model,
      ambientLightAmount: 0.3,
      diffuseLightAmount: 0.7,
      color,
      alpha,
    }}
    attributes={{
      position,
      normal,
    }}
    elements={elements}
    cull={cull}
    args={args}
  />
): React.AbstractComponent<Props>);
