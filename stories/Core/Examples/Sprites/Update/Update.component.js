// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

import vert from './Update.vert';
import frag from './Update.frag';

const { Drawable } = ReactRegl;

const depth = {
  enable: false,
};

const shapeX = ({ viewportWidth }) => viewportWidth;
const shapeY = ({ viewportHeight }) => viewportHeight;

const attributes = {
  position: [
    0, -4,
    4, 4,
    -4, 4,
  ],
};

type Props = {
  framebuffer: ({ tick: number }) => any,
  state: ({ tick: number }) => any,
};

export default (({ framebuffer, state }: Props) => (
  <Drawable
    vert={vert}
    frag={frag}
    depth={depth}
    framebuffer={framebuffer}
    uniforms={{
      state,
      shapeX,
      shapeY,
      deltaT: 0.1,
      gravity: -0.5,
    }}
    attributes={attributes}
    primitive="triangles"
    elements={null}
    offset={0}
    count={3}
  />
): React.AbstractComponent<Props>);
