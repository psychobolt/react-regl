import React from 'react';
import { Frame, Context, Drawable } from '@psychobolt/react-regl';
import ReglContainer from 'stories/Setup/Resizable';
import attachCamera from 'canvas-orbit-camera';
import mat4 from 'gl-mat4';
import normals from 'angle-normals';
import bunny from 'bunny';

import Depth from './Depth';
import Normal from './Normal';
import Mesh from './Mesh';

const contextProps = {
  extensions: 'oes_texture_float',
};

const SHADOW_RES = 1024;

let camera;
let fbo;

function onMount({ regl, view }) {
  camera = attachCamera(view);
  // configure initial camera view.
  camera.rotate([0.0, 0.0], [0.0, -0.4]);
  camera.zoom(10.0);

  fbo = regl.framebuffer({
    color: regl.texture({
      width: SHADOW_RES,
      height: SHADOW_RES,
      wrap: 'clamp',
      type: 'float',
    }),
    depth: true,
  });
}

const planeElements = [
  3, 1, 0,
  0, 2, 3,
];

const planePosition = [
  -0.5, 0.0, -0.5,
  0.5, 0.0, -0.5,
  -0.5, 0.0, 0.5,
  0.5, 0.0, 0.5,
];

const planeNormal = [
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
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

const lightDir = [0.39, 0.87, 0.29];

const uniforms = {
  lightDir,
  lightView: mat4.lookAt([], lightDir, [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]),
  lightProjection: mat4.ortho([], -25, 25, -20, 20, -25, 25),
};

const Bunny = props => (
  <Mesh
    elements={bunny.cells}
    position={bunny.positions}
    normal={normals(bunny.cells, bunny.positions)}
    {...props}
  />
);

const boxArgs = {
  scale: 4.2,
  translate: [0.0, 9.0, 0],
};
const boxColor = [0.05, 0.5, 0.5];
const Box = () => (
  <Mesh
    elements={boxElements}
    position={boxPosition}
    normal={boxNormal}
    args={boxArgs}
    color={boxColor}
  />
);

const planeArgs = {
  scale: 80.0,
  translate: [0.0, 0.0, 0.0],
};
const planeColor = [1.0, 1.0, 1.0];
const Plane = () => (
  <Mesh
    elements={planeElements}
    position={planePosition}
    normal={planeNormal}
    args={planeArgs}
    color={planeColor}
  />
);

const onFrame = () => camera.tick();

const Meshes = () => (
  <Context.Consumer>
    {({ context }) => (
      <>
        <Drawable render={() => context.regl.clear({
          color: [0, 0, 0, 255],
          depth: 1,
        })}
        />
        <Box />
        <Plane />
        <Bunny
          args={({ tick }) => {
            const t = tick * 0.02;
            const r = 8.0;
            return {
              scale: 0.7,
              translate: [r * Math.sin(t), 3.3, r * Math.cos(t)],
            };
          }}
          color={[0.55, 0.2, 0.05]}
        />
        <Bunny
          args={({ tick }) => {
            const t = (tick - 100) * 0.015;
            const r = 5.0;
            return {
              scale: 0.8,
              translate: [r * Math.sin(t), 12.3, r * Math.cos(t)],
            };
          }}
          color={[0.55, 0.55, 0.05]}
        />
      </>
    )}
  </Context.Consumer>
);

const view = () => camera.view();

export default () => (
  <ReglContainer contextProps={contextProps} onMount={onMount}>
    <Context.Consumer>
      {() => (
        <Frame onFrame={onFrame}>
          <Drawable uniforms={uniforms}>
            <Depth framebuffer={fbo}>
              <Meshes />
            </Depth>
            <Normal view={view} fbo={fbo} shadowRes={SHADOW_RES}>
              <Meshes />
            </Normal>
          </Drawable>
        </Frame>
      )}
    </Context.Consumer>
  </ReglContainer>
);
