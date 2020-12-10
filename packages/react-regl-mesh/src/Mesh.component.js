// @flow
import * as React from 'react';
import { Drawable } from '@psychobolt/react-regl';
import { vertexNormals } from 'normals';

type Mesh = {
  positions: number[][],
  cells: number[] | number[][],
  barycentric?: number[][],
  attributes: {
    normal?: number[][],
  },
};

type Props = {
  positions: number[][],
  cells: number[] | number[][],
  normals: boolean | number[][],
  wireframe: Boolean,
  attributes: {},
};

export default (({ positions, cells, normals = false, wireframe, attributes, ...props }: Props) => {
  let mesh: Mesh = {
    positions,
    cells,
    attributes: {
      ...(
        typeof normals !== 'boolean' && normals.length
          ? { normal: normals }
          : normals && { normal: vertexNormals(cells, positions) }
      ),
    },
  };
  let attr = attributes;
  if (wireframe) {
    mesh = require('glsl-solid-wireframe')(mesh, { attributes: mesh.attributes }); // eslint-disable-line global-require
    attr = {
      ...attr,
      barycentric: mesh.barycentric,
    };
  }
  if (mesh.attributes.normal) {
    attr = {
      ...attr,
      normal: mesh.attributes.normal,
    };
  }
  return (
    <Drawable
      {...props}
      attributes={{
        ...attr,
        position: mesh.positions,
      }}
      elements={mesh.cells}
    />
  );
}: React.AbstractComponent<Props>);
