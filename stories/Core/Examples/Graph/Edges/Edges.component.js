// @flow
import * as React from 'react';
import { Drawable } from '@psychobolt/react-regl';

import { VERTEX_TEXTURE_SIZE, ARCS, vertexIndex } from '../constants';
import vert from './Edges.vert';
import frag from './Edges.frag';

const attributes = {
  id: ARCS.map(arc => {
    const s = vertexIndex(arc[0]);
    const t = vertexIndex(arc[1]);
    return [
      s[0] / VERTEX_TEXTURE_SIZE,
      s[1] / VERTEX_TEXTURE_SIZE,
      t[0] / VERTEX_TEXTURE_SIZE,
      t[1] / VERTEX_TEXTURE_SIZE,
    ];
  }),
  arcDir: ARCS.map((arc, i) => i % 2),
};

const depth = {
  enable: false,
  mask: false,
};

const args = [
  { dir: 0 },
  { dir: 1 },
];

type Props = {
  vertexState: any[],
  dir: any,
  lineWidth: number,
};

export default ({ vertexState, dir, lineWidth }: Props) => (
  <Drawable
    vert={vert}
    frag={frag}
    attributes={attributes}
    uniforms={{
      vertexState: ({ tick }) => vertexState[tick % 2],
      dir,
    }}
    depth={depth}
    count={ARCS.length}
    primitive="lines"
    lineWidth={lineWidth}
    args={args}
  />
);
