import React from 'react';
import { Resource, Frame, Context, Drawable } from '@psychobolt/react-regl';
import attachCamera from 'canvas-orbit-camera';
import mat4 from 'gl-mat4';

import ReglContainer from 'stories/Core/Setup/Resizable';

import frag from './Minecraft.frag';
import vert from './Minecraft.vert';
import atlas from './atlas.png';

let camera;

const onMount = ({ view }) => {
  camera = attachCamera(view);
  // configure initial camera view.
  camera.rotate([0.0, 0.0], [0.0, -0.4]);
  camera.zoom(15.0);
};

// all the positions of a single block.
const blockPosition = [
  // side faces
  // positive z face.
  [[-0.5, +0.5, +0.5], [+0.5, +0.5, +0.5], [+0.5, -0.5, +0.5], [-0.5, -0.5, +0.5]],
  // positive x face
  [[+0.5, +0.5, +0.5], [+0.5, +0.5, -0.5], [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5]],
  // negative z face
  [[+0.5, +0.5, -0.5], [-0.5, +0.5, -0.5], [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5]],
  // negative x face.
  [[-0.5, +0.5, -0.5], [-0.5, +0.5, +0.5], [-0.5, -0.5, +0.5], [-0.5, -0.5, -0.5]],
  // top faces
  [[-0.5, +0.5, -0.5], [+0.5, +0.5, -0.5], [+0.5, +0.5, +0.5], [-0.5, +0.5, +0.5]],
];

// all the uvs of a single block.
const blockUv = [
  // side faces
  [[0.0, 0.5], [0.5, 0.5], [0.5, 1.0], [0.0, 1.0]],
  [[0.0, 0.5], [0.5, 0.5], [0.5, 1.0], [0.0, 1.0]],
  [[0.0, 0.5], [0.5, 0.5], [0.5, 1.0], [0.0, 1.0]],
  [[0.0, 0.5], [0.5, 0.5], [0.5, 1.0], [0.0, 1.0]],
  // top
  [[0.0, 0.0], [0.5, 0.0], [0.5, 0.5], [0.0, 0.5]],
];

// all the normals of a single block.
const blockNormal = [
  // side faces
  [[0.0, 0.0, +1.0], [0.0, 0.0, +1.0], [0.0, 0.0, +1.0], [0.0, 0.0, +1.0]],
  [[+1.0, 0.0, 0.0], [+1.0, 0.0, 0.0], [+1.0, 0.0, 0.0], [+1.0, 0.0, 0.0]],
  [[0.0, 0.0, -1.0], [0.0, 0.0, -1.0], [0.0, 0.0, -1.0], [0.0, 0.0, -1.0]],
  [[-1.0, 0.0, 0.0], [-1.0, 0.0, 0.0], [-1.0, 0.0, 0.0], [-1.0, 0.0, 0.0]],
  // top
  [[0.0, +1.0, 0.0], [0.0, +1.0, 0.0], [0.0, +1.0, 0.0], [0.0, +1.0, 0.0]],
];

// the terrain is just described by some sine functions.
const freq = 30.0;
const evalHeight = (x, z) => Math.round(
  2.0 * Math.sin(freq * 1.0 * 3.14 * x) * Math.sin(freq * 2.0 * 3.14 * z)
  + 3.0 * Math.cos(freq * 4.0 * 3.14 * x + 2.1) * Math.sin(freq * 5.0 * 3.14 * z + 0.9)
  + 1.0 * Math.cos(freq * 8.0 * 3.14 * x + 43.43) * Math.cos(freq * 3.0 * 3.14 * z + 34.3),
);

// these contains all the geometry of the world.
// you can add blocks to these arrays by calling addBlock()
const uv = [];
const elements = [];
const position = [];
const normal = [];

const addBlock = (x, y, z) => {
  let index = position.length;

  for (let i = 0; i < 5; i += 1) {
    if (i === 0 && y <= evalHeight(x, z + 1)) { // positive z face
      continue; // eslint-disable-line no-continue, no visible, skip
    }
    if (i === 1 && y <= evalHeight(x + 1, z)) { // positive x face
      continue; // eslint-disable-line no-continue, not visible, skip
    }
    if (i === 2 && y <= evalHeight(x, z - 1)) { // negative z face
      continue; // eslint-disable-line no-continue, not visible, skip
    }
    if (i === 3 && y <= evalHeight(x - 1, z)) { // negative x face
      continue; // eslint-disable-line no-continue, not visible, skip
    }

    let j;

    // add positions.
    for (j = 0; j < blockPosition[i].length; j += 1) {
      const p = blockPosition[i][j];
      position.push([p[0] + x, p[1] + y, p[2] + z]);
    }

    // add normals.
    for (j = 0; j < blockNormal[i].length; j += 1) {
      const n = blockNormal[i][j];
      normal.push([n[0], n[1], n[2]]);
    }

    // add uvs.
    for (j = 0; j < blockUv[i].length; j += 1) {
      const a = blockUv[i][j];
      uv.push([a[0], a[1]]);
    }

    // add quad face.
    elements.push([2 + index, 1 + index, 0 + index]);
    elements.push([2 + index, 0 + index, 3 + index]);

    index += 4; // next quad.
  }
};

const S = 40; // world size.

// create world:
for (let x = -S; x <= S; x += 1) {
  for (let z = -S; z <= S; z += 1) {
    const y = evalHeight(x, z);
    addBlock(x, y, z);
  }
}

const onFrame = () => camera.tick();

const cull = {
  enable: true,
  face: 'back',
};

const drawContext = {
  view: () => camera.view(),
};

const projection = ({ viewportWidth, viewportHeight }) => mat4.perspective(
  [],
  Math.PI / 4,
  viewportWidth / viewportHeight,
  0.01,
  1000,
);

export default () => (
  <ReglContainer onMount={onMount}>
    <Context.Consumer>
      {({ context }) => (
        <Resource
          manifest={{
            atlas: {
              type: 'image',
              src: atlas,
              parser: data => context.regl.texture({
                mag: 'nearest',
                mipmap: true,
                min: 'linear mipmap linear',
                data,
              }),
            },
          }}
        >
          {assets => (
            <Frame onFrame={onFrame}>
              <Drawable
                cull={cull}
                context={drawContext}
                frag={frag}
                vert={vert}
                uniforms={{
                  view: context.regl.context('view'),
                  projection,
                  atlas: context.regl.prop('atlas'),
                }}
                attributes={{
                  position: context.regl.prop('position'),
                  uv: context.regl.prop('uv'),
                  normal: context.regl.prop('normal'),
                }}
                elements={context.regl.prop('elements')}
                args={{ position, elements, uv, normal, atlas: assets.atlas }}
              />
            </Frame>
          )}
        </Resource>
      )}
    </Context.Consumer>
  </ReglContainer>
);
