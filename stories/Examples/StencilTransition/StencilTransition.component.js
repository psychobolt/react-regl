import React from 'react';
import { Frame, Drawable } from '@psychobolt/react-regl';
import ReglContainer from 'stories/Setup/Resizable';
import mat4 from 'gl-mat4';
import tform from 'geo-3d-transform-mat4';
import normals from 'angle-normals';
import seedrandom from 'seedrandom';
import bunny from 'bunny';
import boundingBox from 'vertices-bounding-box';

import Mesh from './Mesh';
import FullScreenTexture, { CYCLE_LENGTH } from './FullScreenTexture';
import Mask from './Mask';
import FilterMask0 from './FilterMask0';
import FilterMask1 from './FilterMask1';

function ref(canvas) {
  ref.current = canvas
    ? canvas.getContext('webgl', {
      antialias: true,
      stencil: true,
    })
    : null;
}

const viewProps = {
  ref,
};

// center the rabbit mesh to the origin
function centerMesh(mesh) {
  const bb = boundingBox(mesh.positions);
  const t = [
    -0.5 * (bb[0][0] + bb[1][0]),
    -0.5 * (bb[0][1] + bb[1][1]),
    -0.5 * (bb[0][2] + bb[1][2]),
  ];
  const translate = mat4.create();
  mat4.translate(translate, translate, t);
  return {
    ...mesh,
    positions: tform(mesh.positions, translate),
  };
}
const bunnyMesh = centerMesh(bunny);

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

const rng = seedrandom('seed.');

const textures = []; // transition textures.
const TEX_W = 64; // width of a transiton texture
const TEX_H = 64; // height of a transition texture
const N_TEX = 20; // how many tansition texture we use.

/*
  To implement the transition effect, we have a bunch of textures that we cycle through, and
  render to the stencil buffer.

  The texture returned f = 0 is all white, and f = 1 is all black. But f = 0.5 will be random
  noise, where about in average, half the pixels are white, and the other half are black.
*/
function makeTexture(regl, f) {
  const texData = [];

  for (let y = 0; y < TEX_W; y += 1) {
    const r = [];
    for (let x = 0; x < TEX_H; x += 1) {
      const rand = rng();
      const g = rand > f ? 255 : 0;
      r.push([g, g, g, 255]);
    }
    texData.push(r);
  }

  return regl.texture({
    mag: 'nearest',
    wrap: 'repeat',
    data: texData,
  });
}

function onMount({ regl }) {
  // create all transition textures.
  for (let i = 0; i <= N_TEX; i += 1) {
    textures[i] = makeTexture(regl, i / N_TEX);
  }
}

const cull = {
  enable: true,
};

const Bunny = props => (
  <Mesh
    elements={bunnyMesh.cells}
    position={bunnyMesh.positions}
    normal={normals(bunnyMesh.cells, bunnyMesh.positions)}
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

const boxColor = [0.0, 0.5, 0.0];
const bunnyColor = [0.6, 0.0, 0.0];

// These are the scenes we will be transitioning between.
const Scene0 = () => <Box scale={10.2} color={boxColor} />;
const Scene1 = () => <Bunny scale={1.0} color={bunnyColor} />;

let F0 = FilterMask0;
let F1 = FilterMask1;

export default class StencilTransition extends React.Component {
  onFrame = ({ tick, regl }) => {
    regl.clear({
      color: [0, 0, 0, 255],
      depth: 1,
      stencil: 0,
    });

    const normTick = tick % CYCLE_LENGTH; // normalize tick to be in range [0, CYCLE_LENGTH - 1]
    let t = normTick * normTick * 0.001;
    if (t > 1.0) {
      t = 1.0;
    }

    if ((tick % CYCLE_LENGTH) === 0) {
      // One cycle is over. So swap filters.
      const temp = F0;
      F0 = F1;
      F1 = temp;
      this.forceUpdate();
    }
  }

  render() {
    return (
      <ReglContainer viewProps={viewProps} onMount={onMount}>
        <Frame onFrame={this.onFrame}>
          <Drawable cull={cull}>
            {/* first, render to stencil buffer */}
            <Mask>
              <FullScreenTexture textures={textures} count={N_TEX} width={TEX_W} height={TEX_H} />
            </Mask>
            {/*
              then actually render the scenes.
              and we are using the stencil buffer to mask the scenes
            */}
            <F0><Scene0 /></F0>
            <F1><Scene1 /></F1>
          </Drawable>
        </Frame>
      </ReglContainer>
    );
  }
}
