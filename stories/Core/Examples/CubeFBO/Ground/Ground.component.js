import React from 'react';
import { Context, Drawable } from '@psychobolt/react-regl';

import frag from './Ground.frag';
import vert from './Ground.vert';

const attributes = {
  p: [
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
  ],
};

const args = {
  height: -5.0,
  tiles: 20,
};

export default () => (
  <Context.Consumer>
    {({ context }) => (
      <Drawable
        frag={frag}
        vert={vert}
        attributes={attributes}
        uniforms={{
          projection: context.regl.context('projection'),
          view: context.regl.context('view'),
          tileSize: context.regl.prop('tiles'),
          height: context.regl.prop('height'),
        }}
        count={6}
        args={args}
      />
    )}
  </Context.Consumer>
);
