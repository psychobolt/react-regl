import React from 'react';
import { ReglContainer, Context, Drawable } from '@psychobolt/react-regl';

import frag from './Elements.frag';
import vert from './Elements.vert';

const attributes = {
  position: (new Array(5).fill().map((x, i) => {
    const theta = 2.0 * Math.PI * i / 5;
    return [Math.sin(theta), Math.cos(theta)];
  })),
};

const uniforms = {
  color: [1, 0, 0, 1],
};

const elements = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 3],
  [2, 4],
  [3, 4],
];

const clear = ({ regl }) => regl.clear({
  color: [0, 0, 0, 1],
  depth: 1,
});

const LINE_WIDTH = 3;

export default () => (
  <ReglContainer onMount={clear}>
    <Context.Consumer>
      {({ context }) => (
        <Drawable
          frag={frag}
          vert={vert}
          attributes={attributes}
          uniforms={uniforms}
          elements={elements}
          lineWidth={context.regl.limits.lineWidthDims[1] < LINE_WIDTH
            ? context.regl.limits.lineWidthDims[1] : LINE_WIDTH}
        />
      )}
    </Context.Consumer>
  </ReglContainer>
);
