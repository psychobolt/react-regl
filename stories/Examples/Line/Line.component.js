import React from 'react';
import { Frame, Context, Drawable } from '@psychobolt/react-regl';
import attachCamera from 'canvas-orbit-camera';
import mat4 from 'gl-mat4';

import ReglContainer from 'stories/Setup/Resizable';

import vert from './Line.vert';
import frag from './Line.frag';

const { push, unshift } = Array.prototype;

const geometry = {
  polarCurve(buffer, howMany, polarFn) {
    const thetaMax = Math.PI * 2;
    for (let i = 0; i < howMany; i += 1) {
      const theta = i / (howMany - 1) * thetaMax;
      const radius = polarFn(theta, i);
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      buffer.push(x, y, 0);
    }
    return buffer;
  },
};

const links = {
  lineMesh(buffer, howMany, index) {
    for (let i = 0; i < howMany - 1; i += 1) {
      const a = index + i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      buffer.push(
        a, b, c,
        c, b, d,
      );
    }
    return buffer;
  },
};

const buffer = {
  duplicate(BUFFER, STRIDE, SCALE) {
    let stride = STRIDE;
    let dupScale = SCALE;
    if (STRIDE == null) stride = 1;
    if (SCALE == null) dupScale = 1;
    const out = [];
    const component = new Array(stride * 2);
    for (let i = 0, il = BUFFER.length / stride; i < il; i += 1) {
      const index = i * stride;
      for (let j = 0; j < stride; j += 1) {
        const value = BUFFER[index + j];
        component[j] = value;
        component[j + stride] = value * dupScale;
      }
      push.apply(out, component);
    }
    return out;
  },

  mapElement(BUFFER, elementIndex, stride, map) {
    const result = BUFFER;
    for (let i = 0, il = BUFFER.length / stride; i < il; i += 1) {
      const index = elementIndex + i * stride;
      result[index] = map(BUFFER[index], index, i);
    }
    return result;
  },

  pushElement(BUFFER, elementIndex, stride) {
    const component = new Array(stride);
    const ai = elementIndex * stride;
    for (let i = 0; i < stride; i += 1) {
      component[i] = BUFFER[ai + i];
    }
    push.apply(BUFFER, component);
    return BUFFER;
  },

  unshiftElement(BUFFER, elementIndex, stride) {
    const component = new Array(stride);
    const ai = elementIndex * stride;
    for (let i = 0; i < stride; i += 1) {
      component[i] = BUFFER[ai + i];
    }
    unshift.apply(BUFFER, component);
    return BUFFER;
  },
};

const FLOAT_BYTES = Float32Array.BYTES_PER_ELEMENT;

const POINTS = 200;
const POINTS_TOTAL = POINTS + 2;
const curve = geometry.polarCurve([], POINTS, t => Math.sin(2.5 * t) * 20);

const positions = curve.slice();
buffer.mapElement(positions, 2, 3, (v, a, i) => (i / POINTS - 0.5) * 20);
buffer.pushElement(positions, 0, 3);
buffer.unshiftElement(positions, POINTS - 1, 3);

const offset = new Array(POINTS).fill(1).map((v, i) => (i + 1) / POINTS);

const positionsDupSource = new Float32Array(buffer.duplicate(positions, 3));
const positionsDup = new Float32Array(positionsDupSource);
const offsetDup = buffer.duplicate(offset, 1, -1);
const indices = links.lineMesh([], POINTS, 0);

let camera;
let positionBuffer;
let offsetBuffer;
let attributes;
let elements;

const onMount = ({ regl, view }) => {
  camera = attachCamera(view);

  positionBuffer = regl.buffer({
    usage: 'dynamic',
    type: 'float',
    length: POINTS_TOTAL * 2 * 3 * FLOAT_BYTES,
  });

  offsetBuffer = regl.buffer({
    usage: 'static',
    type: 'float',
    length: POINTS_TOTAL * 2 * 1 * FLOAT_BYTES,
    data: offsetDup,
  });

  attributes = {
    prevPosition: {
      buffer: positionBuffer,
      offset: 0,
      stride: FLOAT_BYTES * 3,
    },
    currPosition: {
      buffer: positionBuffer,
      offset: FLOAT_BYTES * 3 * 2,
      stride: FLOAT_BYTES * 3,
    },
    nextPosition: {
      buffer: positionBuffer,
      offset: FLOAT_BYTES * 3 * 4,
      stride: FLOAT_BYTES * 3,
    },
    offsetScale: offsetBuffer,
  };

  elements = regl.elements({
    primitive: 'triangles',
    usage: 'static',
    type: 'uint16',
    data: indices,
  });
};

const uniforms = {
  projection: ({ viewportWidth, viewportHeight }) => mat4.perspective(
    [],
    Math.PI / 2,
    viewportWidth / viewportHeight,
    0.01,
    1000,
  ),
  model: mat4.identity([]),
  view: () => camera.view(),
  aspect: ({ viewportWidth, viewportHeight }) => viewportWidth / viewportHeight,
  color: [0.8, 0.5, 0, 1],
  thickness: 1,
  miter: 0,
};

const onFrame = ({ tick, regl }) => {
  regl.clear({
    color: [0.1, 0.1, 0.1, 1],
    depth: 1,
  });

  camera.tick();

  buffer.mapElement(positionsDup, 2, 3, (v, a, i) => positionsDupSource[a]
    + Math.sin(tick * 0.05 + Math.floor(i / 2) * 0.1) * 5);
  positionBuffer.subdata(positionsDup, 0);
};

export default () => (
  <ReglContainer onMount={onMount}>
    <Frame onFrame={onFrame}>
      <Context.Consumer>
        {() => (
          <Drawable
            attributes={attributes}
            uniforms={uniforms}
            elements={elements}
            vert={vert}
            frag={frag}
          />
        )}
      </Context.Consumer>
    </Frame>
  </ReglContainer>
);
