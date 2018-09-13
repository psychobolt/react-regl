import React from 'react';

import { ReglContainer, Context, Frame, Drawable } from '@psychobolt/react-regl';

import frag from './Batch.frag';
import vert from './Batch.vert';

const attributes = {
  position: [
    0.5, 0,
    0, 0.5,
    1, 1,
  ],
};

const uniforms = {
  color: ({ tick }, props, batchId) => [
    Math.sin(0.02 * ((0.1 + Math.sin(batchId)) * tick + 3.0 * batchId)),
    Math.cos(0.02 * (0.02 * tick + 0.1 * batchId)),
    Math.sin(0.02 * ((0.3 + Math.cos(2.0 * batchId)) * tick + 0.8 * batchId)),
    1,
  ],
  angle: ({ tick }) => 0.01 * tick,
};

const depth = {
  enable: false,
};

const args = [
  { offset: [-1, -1] },
  { offset: [-1, 0] },
  { offset: [-1, 1] },
  { offset: [0, -1] },
  { offset: [0, 0] },
  { offset: [0, 1] },
  { offset: [1, -1] },
  { offset: [1, 0] },
  { offset: [1, 1] },
];

const clear = ({ regl }) => regl.clear({ color: [0, 0, 0, 1] });

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
              ...uniforms,
              offset: context.regl.prop('offset'),
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
