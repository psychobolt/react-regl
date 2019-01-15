import React from 'react';
import attachCamera from 'canvas-orbit-camera';
import normals from 'angle-normals';
import mat4 from 'gl-mat4';
import bunny from 'bunny';

import { Context, Frame, Drawable } from '@psychobolt/react-regl';
import ReglContainer from 'stories/Core/Setup/Resizable';

import frag from './InstanceMesh.frag';
import vert from './InstanceMesh.vert';

const contextProps = {
  extensions: ['angle_instanced_arrays'],
};

const N = 15;
const instances = N * N; // N bunnies on the width, N bunnies on the hieght

const angles = [];
for (let i = 0; i < instances; i += 1) {
  // generate random initial angle.
  angles[i] = Math.random() * (2 + Math.PI);
}

let camera;
let angleBuffer;
let angle;

const onMount = ({ view, regl }) => {
  camera = attachCamera(view);
  camera.rotate([0.0, 0.0], [0.0, -0.4]);
  camera.zoom(70.0);

  angleBuffer = regl.buffer({
    length: angles.length * 4,
    type: 'float',
    usage: 'dynamic',
  });

  angle = {
    buffer: angleBuffer,
    divisor: 1,
  };
};

const onFrame = ({ regl }) => {
  regl.clear({
    color: [0, 0, 0, 1],
  });

  // rotate the bunnies every frame.
  for (let i = 0; i < N * N; i += 1) {
    angles[i] += 0.01;
  }
  angleBuffer.subdata(angles);

  camera.tick();
};

const offset = Array(instances).fill().map((_, i) => [
  (-1 + 2 * Math.floor(i / N) / N) * 120, // x
  0.0, // y
  (-1 + 2 * (i % N) / N) * 120, // z
]);

const color = Array(instances).fill().map((_, i) => {
  const x = Math.floor(i / N) / (N - 1);
  const z = (i % N) / (N - 1);
  return [
    x * z * 0.3 + 0.7 * z,
    x * x * 0.5 + z * z * 0.4,
    x * z * x + 0.35,
  ];
});

const uniforms = {
  proj: ({ viewportWidth, viewportHeight }) => mat4.perspective(
    [],
    Math.PI / 2,
    viewportWidth / viewportHeight,
    0.01,
    1000,
  ),
  model: mat4.identity([]),
  view: () => camera.view(),
};

export default () => (
  <ReglContainer contextProps={contextProps} onMount={onMount}>
    <Context.Consumer>
      {() => (
        <Frame onFrame={onFrame}>
          <Drawable
            frag={frag}
            vert={vert}
            attributes={{
              position: bunny.positions,
              normal: normals(bunny.cells, bunny.positions),
              offset: {
                buffer: offset,
                divisor: 1,
              },
              color: {
                buffer: color,
                divisor: 1,
              },
              angle,
            }}
            elements={bunny.cells}
            instances={instances}
            uniforms={uniforms}
          />
        </Frame>
      )}
    </Context.Consumer>
  </ReglContainer>
);
