// @flow
import * as React from 'react';
import { Drawable } from '@psychobolt/react-regl';
import { vertexNormals } from 'normals';

type Mesh = {
  positions: number[][],
  cells: number[] | number[][],
  barycentric?: number[][],
  attributes: {
    normals?: number[][],
  },
};

type Props = {
  positions: number[][],
  cells: number[] | number[][],
  normals: boolean | number[][],
  wireframe: Boolean,
  attributes: {},
};

export default (({ positions, cells, normals, wireframe, attributes, ...props }: Props) => {
  let mesh: Mesh = {
    positions,
    cells,
    attributes: {
      normals: normals === true ? vertexNormals(cells, positions) : normals || undefined,
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
  return (
    <Drawable
      {...props}
      attributes={{
        ...attr,
        position: mesh.positions,
        normal: mesh.attributes.normals,
      }}
      elements={mesh.cells}
    />
  );
}: React.AbstractComponent<Props>);
