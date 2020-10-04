// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

import { VERTEX_COUNT } from '../constants';
import vert from './Points.vert';
import frag from './Points.frag';

const { Drawable } = ReactRegl;

const depth = {
  enable: false,
  mask: false,
};

type Props = {
  id: any,
  vertexState: any[],
};

export default (({ id, vertexState }: Props) => (
  <Drawable
    vert={vert}
    frag={frag}
    attributes={{
      id,
    }}
    uniforms={{
      vertexState: ({ tick }) => vertexState[tick % 2],
    }}
    depth={depth}
    primitive="points"
    count={VERTEX_COUNT}
    elements={null}
  />
): React.AbstractComponent<Props>);
