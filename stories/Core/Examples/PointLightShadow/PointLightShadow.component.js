import React from 'react';
import { Context, Frame, Drawable } from '@psychobolt/react-regl';
import ReglContainer from 'stories/Core/Setup/Resizable';
import attachCamera from 'canvas-orbit-camera';
import normals from 'angle-normals';
import bunny from 'bunny';

import Depth from './Depth';
import Normal from './Normal';
import Mesh from './Mesh';

const contextProps = {
  extensions: 'oes_texture_float',
};

const lightPos = [0.0, 30.0, 0.0];
const CUBE_MAP_SIZE = 1024;

let camera;
let shadowFbo;

const onMount = ({ view, regl }) => {
  camera = attachCamera(view);
  camera.rotate([0.0, 0.0], [0.0, -0.4]);
  camera.zoom(50.0);

  shadowFbo = regl.framebufferCube({
    radius: CUBE_MAP_SIZE,
    colorFormat: 'rgba',
    colorType: 'float',
  });
};

const planeElements = [
  [3, 1, 0],
  [0, 2, 3],
];
const planePosition = [
  [-0.5, 0.0, -0.5],
  [0.5, 0.0, -0.5],
  [-0.5, 0.0, 0.5],
  [0.5, 0.0, 0.5],
];
const planeNormal = [
  [0.0, 1.0, 0.0],
  [0.0, 1.0, 0.0],
  [0.0, 1.0, 0.0],
  [0.0, 1.0, 0.0],
];

// side faces
const boxPosition = [
  // positive z face.
  [-0.5, +0.5, +0.5], [+0.5, +0.5, +0.5], [+0.5, -0.5, +0.5], [-0.5, -0.5, +0.5],
  // positive x face
  [+0.5, +0.5, +0.5], [+0.5, +0.5, -0.5], [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5],
  // negative z face
  [+0.5, +0.5, -0.5], [-0.5, +0.5, -0.5], [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5],
  // negative x face.
  [-0.5, +0.5, -0.5], [-0.5, +0.5, +0.5], [-0.5, -0.5, +0.5], [-0.5, -0.5, -0.5],
  // top face
  [-0.5, +0.5, -0.5], [+0.5, +0.5, -0.5], [+0.5, +0.5, +0.5], [-0.5, +0.5, +0.5],
  // bottom face
  [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5], [-0.5, -0.5, +0.5],
];

const boxElements = [
  [2, 1, 0], [2, 0, 3],
  [6, 5, 4], [6, 4, 7],
  [10, 9, 8], [10, 8, 11],
  [14, 13, 12], [14, 12, 15],
  [18, 17, 16], [18, 16, 19],
  [20, 21, 22], [23, 20, 22],
];

// all the normals of a single block.
const boxNormal = [
  // side faces
  [0.0, 0.0, +1.0], [0.0, 0.0, +1.0], [0.0, 0.0, +1.0], [0.0, 0.0, +1.0],
  [+1.0, 0.0, 0.0], [+1.0, 0.0, 0.0], [+1.0, 0.0, 0.0], [+1.0, 0.0, 0.0],
  [0.0, 0.0, -1.0], [0.0, 0.0, -1.0], [0.0, 0.0, -1.0], [0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.0], [-1.0, 0.0, 0.0], [-1.0, 0.0, 0.0], [-1.0, 0.0, 0.0],
  // top
  [0.0, +1.0, 0.0], [0.0, +1.0, 0.0], [0.0, +1.0, 0.0], [0.0, +1.0, 0.0],
  // bottom
  [0.0, -1.0, 0.0], [0.0, -1.0, 0.0], [0.0, -1.0, 0.0], [0.0, -1.0, 0.0],
];

const uniforms = {
  lightPos,
};

const Bunny = props => (
  <Mesh
    elements={bunny.cells}
    position={bunny.positions}
    normal={normals(bunny.cells, bunny.positions)}
    {...props}
  />
);
const Box = props => (
  <Mesh elements={boxElements} position={boxPosition} normal={boxNormal} {...props} />
);
const planeArgs = { scale: 130.0, translate: [0.0, 0.0, 0.0] };
const Plane = () => (
  <Mesh
    elements={planeElements}
    position={planePosition}
    normal={planeNormal}
    color={[1.0, 1.0, 1.0]}
    args={planeArgs}
  />
);

let id = 1;

const bunnies = [];
for (let i = 0; i < 1.0; i += 0.1) {
  const theta = Math.PI * 2 * i;
  const R = 20.0;
  const r = ((Math.abs(23232 * i * i + 100212) % 255) / 255) * 0.4 + 0.3;
  const g = ((Math.abs(32278 * i + 213) % 255) / 255) * 0.3 + 0.4;
  const b = ((Math.abs(3112 * i * i * i + 2137 + i) % 255) / 255) * 0.05 + 0.05;
  bunnies.push(
    <Bunny
      key={`bunny_${id}`}
      args={({ tick }) => {
        const phi0 = 0.01 * tick;
        return {
          scale: 0.7,
          translate: [R * Math.cos(theta + phi0), 3.0, R * Math.sin(theta + phi0)],
          color: [r, g, b],
        };
      }}
      color={[r, g, b]}
    />,
  );
  id += 1;
}

id = 1;

const boxes = [];
for (let i = 0; i < 1.0; i += 0.15) {
  const theta = Math.PI * 2 * i;
  const R = 35;
  const r = ((Math.abs(23232 * i * i + 100212) % 255) / 255) * 0.4 + 0.05;
  const g = ((Math.abs(32278 * i + 213) % 255) / 255) * 0.3 + 0.4;
  const b = ((Math.abs(3112 * i * i * i + 2137 + i) % 255) / 255) * 0.4 + 0.4;
  boxes.push(
    <Box
      key={`box_${id}`}
      args={({ tick }) => {
        const phi1 = -0.006 * tick;
        return {
          scale: 4.2,
          translate: [R * Math.cos(theta + phi1), 9.0, R * Math.sin(theta + phi1)],
        };
      }}
      color={[r, g, b]}
    />,
  );
  id += 1;
}

function onFrame() {
  camera.tick();
}

export default () => (
  <ReglContainer contextProps={contextProps} onMount={onMount}>
    <Frame onFrame={onFrame}>
      <Context.Consumer>
        {({ context }) => (
          <Drawable uniforms={uniforms}>
            <Depth lightPos={lightPos} shadowFbo={shadowFbo}>
              <Drawable render={() => context.regl.clear({
                color: [0, 0, 0, 255],
                depth: 1,
              })}
              />
              {bunnies}
              {boxes}
              <Plane />
            </Depth>
            <Normal view={() => camera.view()} shadowFbo={shadowFbo}>
              <Drawable render={() => context.regl.clear({
                color: [0, 0, 0, 255],
                depth: 1,
              })}
              />
              {bunnies}
              {boxes}
              <Plane />
            </Normal>
          </Drawable>
        )}
      </Context.Consumer>
    </Frame>
  </ReglContainer>
);
