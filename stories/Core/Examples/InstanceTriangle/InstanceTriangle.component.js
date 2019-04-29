import React from 'react';
import { ReglContainer, Context, Frame, Drawable } from '@psychobolt/react-regl';

import frag from './InstanceTriangle.frag';
import vert from './InstanceTriangle.vert';

const contextProps = {
  extensions: ['angle_instanced_arrays'],
};

const N = 10;
const instances = N * N; // N triangles on the width, N triangles on the height.

const angles = [];
for (let i = 0; i < instances; i += 1) {
  // generate random initial angle.
  angles[i] = Math.random() * (2 * Math.PI);
}

let angleBuffer;
let angle;

const onMount = ({ regl }) => {
  angleBuffer = regl.buffer({
    length: angles.length * 4,
    type: 'float',
    usage: 'dynamic',
  });

  angle = {
    buffer: angleBuffer,
    divisor: 1, // one seperate angle for every triangle
  };
};

const clear = regl => regl.clear({
  color: [0, 0, 0, 1],
});

const onFrame = ({ regl }) => {
  clear(regl);

  // rotate the triangles every frame.
  for (let i = 0; i < instances; i += 1) {
    angles[i] += 0.01;
  }
  angleBuffer.subdata(angles);
};

const offset = Array(instances).fill().map((_, i) => [
  -1 + 2 * Math.floor(i / N) / N + 0.1, // x
  -1 + 2 * (i % N) / N + 0.1, // y
]);

const color = Array(instances).fill().map((_, i) => {
  const r = Math.floor(i / N) / N;
  const g = (i % N) / N;
  return [r, g, r * g + 0.2];
});

const depth = {
  enable: false,
};

export default () => (
  <ReglContainer onMount={onMount} contextProps={contextProps}>
    <Context.Consumer>
      {() => (
        <Frame onFrame={onFrame}>
          <Drawable
            frag={frag}
            vert={vert}
            attributes={{
              position: [[0.0, -0.05], [-0.05, 0.0], [0.05, 0.05]],
              offset: {
                buffer: offset,
                divisor: 1, // one seperate offset for every triangle
              },
              color: {
                buffer: color,
                divisor: 1, // one seperate color for every triangle
              },
              angle,
            }}
            depth={depth}
            count={3}
            instances={instances}
          />
        </Frame>
      )}
    </Context.Consumer>
  </ReglContainer>
);
