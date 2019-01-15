import React from 'react';
import { Frame, Drawable } from '@psychobolt/react-regl';
import ReglContainer from 'stories/Core/Setup/Resizable';
import attachCamera from 'canvas-orbit-camera';
import mat4 from 'gl-mat4';
import normals from 'angle-normals';
import bunny from 'bunny';

import Reflect from './Reflect';
import Mask from './Mask';
import Mesh from './Mesh';
import frag from './PlanarReflection.frag';
import vert from './PlanarReflection.vert';

function ref(canvas) {
  ref.current = canvas ? canvas.getContext('webgl', {
    antialias: true,
    stencil: true,
  }) : null;
}

const viewProps = {
  ref,
};

let camera;

const onMount = ({ view }) => {
  // configure initial camera view.
  camera = attachCamera(view);
  camera.rotate([0.0, 0.0], [0.0, -0.4]);
  camera.zoom(50.0);
};

const N = 12; // number of floor tiles.
const TILE_WHITE = [1.0, 1.0, 1.0];
const TILE_BLACK = [0.4, 0.4, 0.4];
const TILE_ALPHA = 0.5;
const FLOOR_SCALE = 70.0;

function createTiles(A) {
  const planeElements = [];
  const planePosition = [];
  const planeNormal = [];

  for (let row = 0; row <= N; row += 1) {
    const z = (row / N) - 0.5;
    for (let col = 0; col <= N; col += 1) {
      const x = (col / N) - 0.5;
      planePosition.push([x, 0.0, z]);
      planeNormal.push([0.0, 1.0, 0.0]);
    }
  }

  for (let row = 0; row <= (N - 1); row += 1) {
    for (let col = 0; col <= (N - 1); col += 1) {
      const i = row * (N + 1) + col;
      const i0 = i + 0;
      const i1 = i + 1;
      const i2 = i + (N + 1) + 0;
      const i3 = i + (N + 1) + 1;
      if ((col + row) % 2 === A) {
        planeElements.push([i3, i1, i0]);
        planeElements.push([i0, i2, i3]);
      }
    }
  }

  return {
    planeElements,
    planePosition,
    planeNormal,
  };
}

// side faces
const boxPosition = [
  [-0.5, +0.5, +0.5],
  [+0.5, +0.5, +0.5],
  [+0.5, -0.5, +0.5],
  [-0.5, -0.5, +0.5],
  // positive z face.
  [+0.5, +0.5, +0.5],
  [+0.5, +0.5, -0.5],
  [+0.5, -0.5, -0.5],
  [+0.5, -0.5, +0.5],
  // positive x face
  [+0.5, +0.5, -0.5],
  [-0.5, +0.5, -0.5],
  [-0.5, -0.5, -0.5],
  [+0.5, -0.5, -0.5],
  // negative z face
  [-0.5, +0.5, -0.5],
  [-0.5, +0.5, +0.5],
  [-0.5, -0.5, +0.5],
  [-0.5, -0.5, -0.5],
  // negative x face.
  [-0.5, +0.5, -0.5],
  [+0.5, +0.5, -0.5],
  [+0.5, +0.5, +0.5],
  [-0.5, +0.5, +0.5],
  // top face
  [-0.5, -0.5, -0.5],
  [+0.5, -0.5, -0.5],
  [+0.5, -0.5, +0.5],
  [-0.5, -0.5, +0.5],
  // bottom face
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
  lightDir: [0.39, 0.87, 0.29],
  view: () => camera.view(),
  projection: ({ viewportWidth, viewportHeight }) => mat4.perspective(
    [],
    Math.PI / 4,
    viewportWidth / viewportHeight,
    0.01,
    1000,
  ),
  yScale: 1.0, // by default, do not render mirrored.
};

// we use alpha blending to render the mirrored floor.
const blend = {
  enable: true,
  func: {
    src: 'src alpha',
    dst: 'one minus src alpha',
  },
};

const onFrame = ({ regl }) => {
  regl.clear({
    color: [0, 0, 0, 255],
    depth: 1,
    stencil: 0,
  });

  camera.tick();
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
  <Mesh
    elements={boxElements}
    position={boxPosition}
    normal={boxNormal}
    {...props}
  />
);

// the white tiles is one mesh, and the black tiles is another.
// we need to render the white tiles seperately to the stencil buffer to
// create the mask, so we split them into two meshes like this.
let obj = createTiles(0);
const whiteTilesArgs = {
  scale: FLOOR_SCALE,
  alpha: TILE_ALPHA,
};
const WhiteTiles = () => (
  <Mesh
    elements={obj.planeElements}
    position={obj.planePosition}
    normal={obj.planeNormal}
    color={TILE_WHITE}
    args={whiteTilesArgs}
  />
);

obj = createTiles(1);
const blackTilesArgs = {
  scale: FLOOR_SCALE,
};
const BlackTiles = () => (
  <Mesh
    elements={obj.planeElements}
    position={obj.planePosition}
    normal={obj.planeNormal}
    color={TILE_BLACK}
    args={blackTilesArgs}
  />
);

const bunnies = [];

let id = 1;
for (let i = 0; i < 1.0; id += 1, i += 0.1) {
  const theta = Math.PI * 2 * i;
  const R = 20.0;

  const r = ((Math.abs(23232 * i * i + 100212) % 255) / 255) * 0.4 + 0.3;
  const g = ((Math.abs(32278 * i + 213) % 255) / 255) * 0.4 + 0.15;
  const b = ((Math.abs(3112 * i * i * i + 2137 + i) % 255) / 255) * 0.05 + 0.05;

  bunnies.push(
    <Bunny
      key={`bunny_${id}`}
      color={[r, g, b]}
      args={({ tick }) => {
        const phi0 = 0.01 * tick;
        return {
          scale: 0.7,
          translate: [R * Math.cos(theta + phi0), 1.0, R * Math.sin(theta + phi0)],
        };
      }}
    />,
  );
}

const boxes = [];

for (let i = 0; i < 1.0; i += 0.1) {
  const theta = Math.PI * 2 * i;
  const R = 35;

  const r = ((Math.abs(23232 * i * i + 100212) % 255) / 255) * 0.4 + 0.05;
  const g = ((Math.abs(32278 * i + 213) % 255) / 255) * 0.3 + 0.4;
  const b = ((Math.abs(3112 * i * i * i + 2137 + i) % 255) / 255) * 0.4 + 0.4;

  boxes.push(
    <Box
      key={`box_${i + 1}`}
      color={[r, g, b]}
      args={({ tick }) => {
        const phi1 = -0.006 * tick;
        return {
          scale: 4.2,
          translate: [R * Math.cos(theta + phi1), 6.0, R * Math.sin(theta + phi1)],
        };
      }}
    />,
  );
}

export default () => (
  <ReglContainer onMount={onMount} viewProps={viewProps}>
    <Frame onFrame={onFrame}>
      <Drawable
        uniforms={uniforms}
        frag={frag}
        vert={vert}
        blend={blend}
      >
        {/*
          First, draw the reflections of the meshes.
        */}
        <Mask><WhiteTiles /></Mask>
        {/*
          Draw the reflection of meshes. Also, use the stencil buffer
          to make sure that we only draw the reflection in the reflecting
          floor tiles.
        */}
        <Reflect>
          {bunnies}
          {boxes}
        </Reflect>
        <WhiteTiles />
        <BlackTiles />
        {/*
          Now draw the actual meshes.
        */}
        {bunnies}
        {boxes}
      </Drawable>
    </Frame>
  </ReglContainer>
);
