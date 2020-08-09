// @flow
import * as React from 'react';

import { Drawable } from '@psychobolt/react-regl';

import frag from './Pyramid.frag';
import vert from './Pyramid.vert';

const getPointOnCircle = (centerX, centerY, radius, angle) => [
  centerX + radius * Math.cos(angle * Math.PI / 180),
  centerY + radius * Math.sin(angle * Math.PI / 180),
];

const getMidpoint = (v0: number[], v1: number[]) => [(v0[0] + v1[0]) / 2, (v0[1] + v1[1]) / 2];

const getTriangle = () => [
  getPointOnCircle(0, 0, 1, 90), // top corner
  getPointOnCircle(0, 0, 1, -45), // right corner
  getPointOnCircle(0, 0, 1, -90 - 45), // left corner
];

const uniforms = {
  color: [0, 0, 0, 1],
};

const depth = {
  enable: false,
};

type Props = {
  degree: number
};

export default ({ degree: n = 0 }: Props) => {
  let vertices = getTriangle();
  let edges = [[0, 1, 2, 0]];

  /*
   if degree = 0,
     then nTriangles = 1, 3^0 = 1
   if degree = 1,
     then nTriangles = 3, 3^1 = 3
   if degree = 2,
     then nTriangles = 9, 3^2 = 9
   if degree = 3,
     then nTriangles = 27, 3^3 = 27
   ...
   if degree = n
     then nTriangles = x, 3^n = x
  */
  for (let i = 1; i < 3 ** n; i *= 3) {
    for (let j = 1; j <= i; j += 1) {
      const [[c0, c1, c2]] = edges.splice(0, 1); // pop the item

      const v0 = vertices[c0];
      const v1 = vertices[c1];
      const v2 = vertices[c2];

      const m01 = getMidpoint(v0, v1);
      const m12 = getMidpoint(v1, v2);
      const m20 = getMidpoint(v2, v0);

      const { length } = vertices;
      const c01 = length;
      const c12 = c01 + 1;
      const c20 = c12 + 1;

      edges = [
        ...edges,
        [c12, c20, c2],
        [c12, c01, c1],
        [c01, c20, c0],
      ];

      vertices = [...vertices, m01, m12, m20];
    }
  }

  return (
    <Drawable
      frag={frag}
      vert={vert}
      attributes={{
        position: vertices,
      }}
      uniforms={uniforms}
      elements={edges}
      depth={depth}
    />
  );
};
