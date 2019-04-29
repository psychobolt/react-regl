// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';
import mat4 from 'gl-mat4';

import frag from './Mesh.frag';
import vert from './Mesh.vert';

const { Drawable } = ReactRegl;

const view = mat4.lookAt([], [0.0, 10.0, 20.0], [0, 0, 0], [0, 1, 0]);

const projection = ({ viewportWidth, viewportHeight }) => mat4.perspective(
  [],
  Math.PI / 4,
  viewportWidth / viewportHeight,
  0.01,
  1000,
);

const lightDir = [0.39, 0.87, 0.29];

type Props = {
  elements: number[],
  position: number[][],
  normal: number[][],
  scale: number,
  color: number[],
}

export default ({ elements, position, normal, scale: s, color, ...props }: Props) => (
  <Drawable
    uniforms={{
      model() {
        const m = mat4.identity([]);
        mat4.scale(m, m, [s, s, s]);
        return m;
      },
      ambientLightAmount: 0.3,
      diffuseLightAmount: 0.7,
      color,
      lightDir,
      view,
      projection,
    }}
    attributes={{
      position,
      normal,
    }}
    elements={elements}
    frag={frag}
    vert={vert}
    {...props}
  />
);
