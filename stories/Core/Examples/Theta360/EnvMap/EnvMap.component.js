// @flow
import * as React from 'react';
import mat4 from 'gl-mat4';

import { Context, Drawable } from '@psychobolt/react-regl';

import frag from './EnvMap.frag';

type Props = {
  envmap: Object,
  children: React.Node
};

const projection = ({ viewportWidth, viewportHeight }) => mat4.perspective(
  [],
  Math.PI / 4,
  viewportWidth / viewportHeight,
  0.01,
  1000,
);

const invView = (context, { view }) => mat4.invert([], view);

export default ({ envmap, children }: Props) => (
  <Context.Consumer>
    {({ context }) => (
      <Drawable
        frag={frag}
        uniforms={{
          envmap,
          PI: Math.PI,
          view: context.regl.prop('view'),
          projection,
          invView,
        }}
      >
        {children}
      </Drawable>
    )}
  </Context.Consumer>
);
