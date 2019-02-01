import React from 'react';
import { ReglContainer, Context, Resource, Frame, Drawable } from '@psychobolt/react-regl';
import Camera from '@psychobolt/react-regl-orbit-camera';
import surfaceNets from 'surface-nets';
import ndarray from 'ndarray';
import normals from 'angle-normals';
import mat3 from 'gl-mat3';

import Background from './Background';
import vert from './Metaball.vert';
import frag from './Metaball.frag';
import sphereTextureJPG from './spheretexture.jpg';
import normalTextureJPG from './normaltexture.jpg';

const center = [1, 1, 1];

const maxCount = 4096;

let positionBuffer;
let normalBuffer;
let cellsBuffer;
let attributes;
let uniforms;

const onMount = ({ regl }) => {
  positionBuffer = regl.buffer({
    length: maxCount * 3 * 4,
    type: 'float',
    usage: 'dynamic',
  });

  normalBuffer = regl.buffer({
    length: maxCount * 3 * 4,
    type: 'float',
    usage: 'dynamic',
  });

  cellsBuffer = regl.elements({
    length: (maxCount * 3 * 3) * 3 * 2,
    count: (maxCount * 3 * 3),
    type: 'uint16',
    usage: 'dynamic',
    primitive: 'triangles',
  });

  attributes = {
    position: {
      buffer: positionBuffer,
    },
    normal: {
      buffer: normalBuffer,
    },
  };

  uniforms = {
    color: [36 / 255.0, 70 / 255.0, 106 / 255.0],
    sphereColor: [36 / 255.0, 70 / 255.0, 106 / 255.0],
    normalScale: 1,
    texScale: 10,
    normalMatrix: context => {
      const a = mat3.create();
      mat3.normalFromMat4(a, context.view);
      return a;
    },
    textureMap: regl.prop('textureMap'),
    normalMap: regl.prop('normalMap'),
  };
};

const numblobs = 20;
const strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);
const subtract = 12;
const size = 50;
const position = (time, i) => [
  Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5,
  Math.cos(i + 1.12 * time * 0.21 * Math.sin((0.72 + 0.83 * i))) * 0.27 + 0.5,
  Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53))) * 0.27 + 0.5,
];
const startBounds = [0.5, 0.5, 0.5];
const endBounds = [1.5, 1.5, 1.5];
const stepSizes = [0, 1, 2].map(i => (endBounds[i] - startBounds[i]) / size);

// Outside the radius of influence, we assume field constribution of zero
const radius = size * Math.sqrt(strength / subtract);

const render = tick => {
  const time = 0.5 * tick;
  const fieldArray = new Float32Array(size * size * size);

  for (let n = 0; n < numblobs; n += 1) {
    const [ballx, bally, ballz] = position(time, n);
    const bounds = [ballx, bally, ballz].map(c => {
      const coordCenter = c * size;
      return [
        Math.max(Math.floor(coordCenter - radius), 1),
        Math.min(Math.floor(coordCenter + radius), size - 1),
      ];
    });
    const [xBounds, yBounds, zBounds] = bounds;

    for (let z = zBounds[0]; z < zBounds[1]; z += 1) {
      const zOffset = size * size * z;

      for (let y = yBounds[0]; y < yBounds[1]; y += 1) {
        const yOffset = size * y;

        for (let x = xBounds[0]; x < xBounds[1]; x += 1) {
          const fx = x / size - ballx;
          const fy = y / size - bally;
          const fz = z / size - ballz;
          const val = strength / (0.000001 + (fx * fx) + (fy * fy) + (fz * fz)) - subtract;
          if (val > 0.0) fieldArray[zOffset + yOffset + x] += val;
        }
      }
    }
  }

  const mesh = surfaceNets(ndarray(fieldArray, [size, size, size]), 80.0);

  // Transform index coordinates to space coordinates
  const coordinatePositions = new Array(mesh.positions.length);
  for (let i = 0; i < mesh.positions.length; i += 1) {
    const meshPosition = mesh.positions[i];
    const transformedPosition = new Array(3);
    for (let j = 0; j < 3; j += 1) {
      transformedPosition[j] = startBounds[j] + (meshPosition[j] * stepSizes[j]);
    }
    coordinatePositions[i] = transformedPosition;
  }

  return { positions: coordinatePositions, cells: mesh.cells };
};

const onFrame = ({ time }) => {
  const mesh = render(time);
  positionBuffer({ data: mesh.positions });
  cellsBuffer({ data: mesh.cells });
  normalBuffer({ data: normals(mesh.cells, mesh.positions) });
};

export default () => (
  <ReglContainer onMount={onMount}>
    <Context.Consumer>
      {({ context }) => (
        <Resource
          manifest={{
            sphereTexture: {
              type: 'image',
              src: sphereTextureJPG,
              parser: data => context.regl.texture({
                data,
                mag: 'linear',
                min: 'linear',
              }),
            },
            normalTexture: {
              type: 'image',
              src: normalTextureJPG,
              parser: data => context.regl.texture({
                data,
                wrapT: 'repeat',
                wrapS: 'repeat',
                min: 'linear mipmap linear',
                mag: 'linear',
              }),
            },
          }}
        >
          {({ sphereTexture, normalTexture }) => (
            <Frame onFrame={onFrame}>
              <Camera
                distance={1.5}
                maxDistance={3}
                minDistance={0.5}
                center={center}
                theta={1.0}
              >
                <Background
                  width={context.regl.context('viewportWidth')}
                  height={context.regl.context('viewportHeight')}
                />
                <Drawable render={() => context.regl.clear({ depth: 1 })} />
                <Drawable
                  vert={vert}
                  frag={frag}
                  attributes={attributes}
                  uniforms={uniforms}
                  elements={cellsBuffer}
                  args={{
                    textureMap: sphereTexture,
                    normalMap: normalTexture,
                  }}
                />
              </Camera>
            </Frame>
          )}
        </Resource>
      )}
    </Context.Consumer>
  </ReglContainer>
);
