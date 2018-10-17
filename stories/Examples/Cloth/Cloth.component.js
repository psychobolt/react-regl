import React from 'react';
import { Context, Resource, Frame, Drawable } from '@psychobolt/react-regl';
import attachCamera from 'canvas-orbit-camera';
import mat4 from 'gl-mat4';
import vec3 from 'gl-vec3';

import ReglContainer from 'stories/Setup/Resizable';

import frag from './Cloth.frag';
import vert from './Cloth.vert';
import cloth from './cloth.png';

const uv = [];
const elements = [];
const position = [];
const oldPosition = [];
const normal = [];
const constraints = [];

let camera;
let normalBuffer;
let positionBuffer;

const onMount = ({ view, regl }) => {
  camera = attachCamera(view);

  // configure initial camera view.
  camera.view(mat4.lookAt([], [0, 3.0, 30.0], [0, 0, -5.5], [0, 1, 0]));
  camera.rotate([0.0, 0.0], [3.14 * 0.15, 0.0]);

  positionBuffer = regl.buffer({
    length: position.length * 3 * 4,
    type: 'float',
    usage: 'dynamic',
  });

  normalBuffer = regl.buffer({
    length: normal.length * 3 * 4,
    type: 'float',
    usage: 'dynamic',
  });
};

// create a constraint between the vertices with the indices i0 and i1.
function Constraint(i0, i1) {
  this.i0 = i0;
  this.i1 = i1;

  this.restLength = vec3.distance(position[i0], position[i1]);
}

const size = 5.5;
const xmin = -size;
const xmax = +size;
const ymin = -size;
const ymax = +size;

// the tesselation level of the cloth.
const N = 20;

let row;
let col;

// create cloth vertices and uvs.
for (row = 0; row <= N; row += 1) {
  const z = (row / N) * (ymax - ymin) + ymin;
  const v = row / N;

  for (col = 0; col <= N; col += 1) {
    const x = (col / N) * (xmax - xmin) + xmin;
    const u = col / N;

    position.push([x, 0.0, z]);
    oldPosition.push([x, 0.0, z]);
    uv.push([u, v]);
  }
}

let i;
let i0;
let i1;
let i2;
let i3;

// for every vertex, create a corresponding normal.
for (i = 0; i < position.length; i += 1) {
  normal.push([0.0, 0.0, 0.0]);
}

// create faces
for (row = 0; row <= (N - 1); row += 1) {
  for (col = 0; col <= (N - 1); col += 1) {
    i = row * (N + 1) + col;

    i0 = i + 0;
    i1 = i + 1;
    i2 = i + (N + 1) + 0;
    i3 = i + (N + 1) + 1;

    elements.push([i3, i1, i0]);
    elements.push([i0, i2, i3]);
  }
}

// create constraints
for (row = 0; row <= (N - 1); row += 1) {
  for (col = 0; col <= (N - 1); col += 1) {
    i = row * (N + 1) + col;

    i0 = i + 0;
    i1 = i + 1;
    i2 = i + (N + 1) + 0;
    i3 = i + (N + 1) + 1;

    // add constraint linked to the element in the next column, if it exists.
    if (col < N) {
      constraints.push(new Constraint(i0, i1));
    }

    // add constraint linked to the element in the next row, if it exists
    if (row < N) {
      constraints.push(new Constraint(i0, i2));
    }

    // add constraint linked to the next diagonal element, if it exists.
    if (col < N && row < N) {
      constraints.push(new Constraint(i0, i3));
    }
  }
}

// no culling, because we'll be rendering both the backside and the frontside of the cloth.
const cull = {
  enable: false,
};

const contextProps = {
  view: () => camera.view(),
};

const projection = ({ viewportWidth, viewportHeight }) => mat4.perspective(
  [],
  Math.PI / 4,
  viewportWidth / viewportHeight,
  0.01,
  1000,
);

const onFrame = ({ tick, regl }) => {
  const deltaTime = 0.017;

  regl.clear({
    color: [0, 0, 0, 255],
    depth: 1,
  });

  //
  // Below we do the cloth simulation.
  //

  let vel = [];
  let next = [];
  const delta = deltaTime;

  const g = [0.0, -4.0, 0.0]; // gravity force vector.

  const windForce = [Math.sign(tick / 2.0), Math.cos(tick / 3.0), Math.sin(tick / 1.0)];
  vec3.normalize(windForce, windForce);
  vec3.scale(windForce, windForce, 20.6);

  for (i = 0; i < position.length; i += 1) {
    //
    // we do verlet integration for every vertex.
    //

    // compute velocity.
    vec3.subtract(vel, position[i], oldPosition[i]);
    vel = [vel[0], vel[1], vel[2]];
    next = [position[i][0], position[i][1], position[i][2]];

    // advance vertex with velocity.
    vec3.add(next, next, vel);

    // apply gravity force.
    vec3.scaleAndAdd(next, next, g, delta * delta);

    // apply wind force.
    vec3.scaleAndAdd(next, next, windForce, delta * delta);

    // keep track of current and old position.
    oldPosition[i] = [position[i][0], position[i][1], position[i][2]];
    position[i] = [next[0], next[1], next[2]];
  }

  const d = [];
  let v0;
  let v1;
  //
  // Attempt to satisfy the constraints by running a couple of iterations.
  //
  for (i = 0; i < 15; i += 1) {
    for (let j = 0; j < constraints.length; j += 1) {
      const c = constraints[j];

      v0 = position[c.i0];
      v1 = position[c.i1];

      vec3.subtract(d, v1, v0);

      const dLength = vec3.length(d);
      const diff = (dLength - c.restLength) / dLength;

      // repulse/attract the end vertices of the constraint.
      vec3.scaleAndAdd(v0, v0, d, +0.5 * diff);
      vec3.scaleAndAdd(v1, v1, d, -0.5 * diff);
    }
  }

  // we make some vertices at the edge of the cloth unmovable.
  for (i = 0; i <= N; i += 1) {
    position[i] = [oldPosition[i][0], oldPosition[i][1], oldPosition[i][2]];
  }

  // next, we recompute the normals
  for (i = 0; i < normal.length; i += 1) {
    normal[i] = [0.0, 0.0, 0.0];
  }

  //
  for (i = 0; i < elements.length; i += 1) {
    [i0, i1, i2] = elements[i];

    const p0 = position[i0];
    const p1 = position[i1];
    const p2 = position[i2];

    v0 = [0.0, 0.0, 0.0];
    vec3.subtract(v0, p0, p1);

    v1 = [0.0, 0.0, 0.0];
    vec3.subtract(v1, p0, p2);

    // compute face normal.
    const n0 = [0.0, 0.0, 0.0];
    vec3.cross(n0, v0, v1);
    vec3.normalize(n0, n0);

    // add face normal to vertices of face.
    vec3.add(normal[i0], normal[i0], n0);
    vec3.add(normal[i1], normal[i1], n0);
    vec3.add(normal[i2], normal[i2], n0);
  }

  // the average of the total face normals approximates the vertex normals.
  for (i = 0; i < normal.length; i += 1) {
    vec3.normalize(normal[i], normal[i]);
  }

  /*
    Make sure that we stream the positions and normals to their buffers,
    since these are updated every frame.
  */
  positionBuffer.subdata(position);
  normalBuffer.subdata(normal);

  camera.tick();
};

export default () => (
  <ReglContainer onMount={onMount}>
    <Context.Consumer>
      {({ context }) => (
        <Resource
          manifest={{
            clothTexture: {
              type: 'image',
              src: cloth,
              parser: data => context.regl.texture({
                mag: 'nearest',
                mipmap: true,
                min: 'linear mipmap linear',
                data,
                wrap: 'repeat',
              }),
            },
          }}
        >
          {({ clothTexture }) => (
            <Frame onFrame={onFrame}>
              <Drawable
                cull={cull}
                context={contextProps}
                frag={frag}
                vert={vert}
                uniforms={{
                  view: context.regl.context('view'),
                  projection,
                  texture: context.regl.prop('clothTexture'),
                }}
                attributes={{
                  position: {
                    buffer: positionBuffer,
                    normalized: true,
                  },
                  uv: context.regl.prop('uv'),
                  normal: {
                    buffer: normalBuffer,
                    normalized: true,
                  },
                }}
                elements={context.regl.prop('elements')}
                args={{
                  elements,
                  uv,
                  clothTexture,
                }}
              />
            </Frame>
          )}
        </Resource>
      )}
    </Context.Consumer>
  </ReglContainer>
);
