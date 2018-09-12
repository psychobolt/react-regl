// @flow
import * as React from 'react';
import mat4 from 'gl-mat4';
import normals from 'angle-normals';
import bunny from 'bunny';

import { Drawable } from 'src';

import frag from './Bunny.frag';
import vert from './Bunny.vert';

const attributes = {
  position: bunny.positions,
  normal: normals(bunny.cells, bunny.positions),
};

const model = (_, { position, scale: s, rotation: r }) => {
  /*
    By using props, we translate the bunny, scale it, and rotate it.
  */
  const m = mat4.identity([]);
  mat4.translate(m, m, position);
  mat4.scale(m, m, [s, s, s]);
  mat4.rotateX(m, m, r[0]);
  mat4.rotateY(m, m, r[1]);
  mat4.rotateZ(m, m, r[2]);
  return m;
};

const args = [
  { color: [0.4, 0.2, 0.1], scale: 1.7, position: [0.0, -65.0, 0.0], rotation: [0.0, 0.8, 0.0] },
  {
    color: [0.6, 0.2, 0.5], scale: 5.2, position: [30.0, -65.0, -80.0], rotation: [-0.5, 0.0, 0.0],
  },
  {
    color: [0.4, 0.2, 0.6],
    scale: 1.5,
    position: [120.0, -55.0, -100.0],
    rotation: [-0.5, 1.9, 0.0],
  },
  { color: [0.7, 0.7, 0.7], scale: 2.2, position: [50.0, -60.0, 0.0], rotation: [-0.2, 0.0, 0.0] },
  { color: [0.0, 0.2, 0.5], scale: 1.0, position: [-50.0, -60.0, 0.0], rotation: [0.0, 1.2, 0.0] },
  { color: [0.4, 0.4, 0.0], scale: 1.0, position: [-50.0, -45.0, 40.0], rotation: [0.0, 0, -0.6] },
  {
    color: [0.2, 0.2, 0.2], scale: 3.3, position: [100.0, -65.0, 50.0], rotation: [0.0, -0.4, -0.0],
  },
  { color: [0.4, 0.1, 0.1], scale: 2.1, position: [70.0, -65.0, 80.0], rotation: [0.1, 0.6, 0.2] },
  {
    color: [0.2, 0.5, 0.2], scale: 6.1, position: [-50.0, -70.0, 80.0], rotation: [0.0, -0.9, 0.0],
  },
  {
    color: [0.3, 0.5, 0.5], scale: 4.1, position: [-50.0, -70.0, -60.0], rotation: [0.7, -0.0, 0.0],
  },
  {
    color: [0.4, 0.4, 0.1],
    scale: 1.8,
    position: [-80.0, -50.0, -110.0],
    rotation: [0.0, -0.0, 0.0],
  },
  {
    color: [0.7, 0.4, 0.1],
    scale: 1.3,
    position: [-120.0, -85.0, -40.0],
    rotation: [0.0, +2.1, -0.3],
  },
];

type Props = {
  color: any
};

export default ({ color }: Props) => (
  <Drawable
    frag={frag}
    vert={vert}
    elements={bunny.cells}
    attributes={attributes}
    uniforms={{
      model,
      color,
    }}
    args={args}
  />
);
