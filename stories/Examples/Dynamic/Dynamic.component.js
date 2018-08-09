import React from 'react';

import { ReglContainer, Frame, Context, Drawable } from 'src';

import frag from './Dynamic.frag';
import vert from './Dynamic.vert';

const attributes = {
  position: [
    -1, 0,
    0, -1,
    1, 1,
  ],
};

const depth = {
  enable: false,
};

const args = ({ tick }) => ({
  color: [
    Math.sin(0.02 * (0.001 * tick)),
    Math.sin(0.02 * (0.02 * tick)),
    Math.sin(0.02 * (0.3 * tick)),
    1,
  ],
});

const clear = ({ regl }) => regl.clear({
  color: [0, 0, 0, 1],
});

export default () => (
  <ReglContainer>
    <Frame onFrame={clear}>
      <Context.Consumer>
        {({ context }) => (
          <Drawable
            frag={frag}
            vert={vert}
            attributes={attributes}
            uniforms={{
              color: context.regl.prop('color'),
              angle: ({ tick }) => 0.01 * tick,
            }}
            depth={depth}
            count={3}
            args={args}
          />
        )}
      </Context.Consumer>
    </Frame>
  </ReglContainer>
);
