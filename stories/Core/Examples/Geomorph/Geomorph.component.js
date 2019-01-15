import React from 'react';
import { ReglContainer, Frame, Drawable } from '@psychobolt/react-regl';
import mat4 from 'gl-mat4';
import bunny from 'bunny';

import vert from './Geomorph.vert';
import frag from './Geomorph.frag';

// We'll generate 4 refined levels of detail for the bunny mesh
const NUM_LODS = 4;

// First we extract the edges from the bunny mesh
const lodCells = bunny.cells.reduce((edges, cell) => {
  edges.push(
    [cell[0], cell[1]],
    [cell[1], cell[2]],
    [cell[2], cell[0]],
  );
  return edges;
}, []);

// We initialize the finest level of detail to be just the msh
const lodPositions = [bunny.positions];
const lodOffsets = [lodCells.length];

// For each level of detail, we cluster the vertices and then move all
// of the non-degenerate cells to the front of the buffer
for (let lod = 1; lod <= NUM_LODS; lod += 1) {
  const points = lodPositions[lod - 1];

  // Here we use an exponentially growing bin size, through you could really
  // use whatever you like here as long as it is monotonically increasing
  const binSize = 0.2 * (2.2 ** lod);

  // For the first phase of clusering, we map each vertex into a bin
  const grid = {};
  points.forEach((p, i) => {
    const binId = p.map(x => Math.floor(x / binSize)).join();
    if (binId in grid) {
      grid[binId].push(i);
    } else {
      grid[binId] = [i];
    }
  });

  // Next we iterate over the bins and snap each vertex to the centroid of
  // all vertices in its bin
  const snapped = Array(points.length);
  Object.keys(grid).forEach(binId => {
    const bin = grid[binId];
    const centroid = [0, 0, 0];
    bin.forEach(idx => {
      const p = points[idx];
      for (let i = 0; i < 3; i += 1) {
        centroid[i] += p[i] / bin.length;
      }
    });
    bin.forEach(idx => {
      snapped[idx] = centroid;
    });
  });
  lodPositions.push(snapped);

  // Finally we partition the cell array in place so that all non-degenerate
  // cells are moved to the front of the array
  const cellCount = lodOffsets[lod - 1];
  let ptr = 0;
  for (let idx = 0; idx < cellCount; idx += 1) {
    const cell = lodCells[idx];
    if (snapped[cell[0]] !== snapped[cell[1]]) {
      lodCells[idx] = lodCells[ptr];
      lodCells[ptr] = cell;
      ptr += 1;
    }
  }

  // And we save this offset of the last non degenerate cell so that we
  // draw at this level of detail we don't waste time drawing degenerate cells
  lodOffsets.push(ptr);
}

let lodBuffers;
const onMount = ({ regl }) => {
  // Now that the LODs are computed we upload them to the GPU
  lodBuffers = lodPositions.map(regl.buffer);
};

const onUpdate = ({ regl, draw, tick }) => {
  regl.clear({
    depth: 1,
    color: [0, 0, 0, 1],
  });

  // To use the LOD draw command, we just pass it an object with the LOD as
  // a single property:
  draw({
    lod: Math.min(NUM_LODS, Math.max(0, 0.5 * NUM_LODS * (1 + Math.cos(0.003 * tick)))),
  });
};

// We take the two LOD attributes directly above and below the current
// fractional LOD
const attributes = {
  p0: (_, { lod }) => lodBuffers[Math.floor(lod)],
  p1: (_, { lod }) => lodBuffers[Math.ceil(lod)],
};

const uniforms = {
  // This is a standard perspective camera
  projection: ({ viewportWidth, viewportHeight }) => mat4.perspective(
    [],
    Math.PI / 4,
    viewportWidth / viewportHeight,
    0.01,
    1000,
  ),

  // We slowly rotate the camera around the center of the bunny
  view: ({ tick }) => {
    const t = 0.004 * tick;
    return mat4.lookAt(
      [],
      [20 * Math.cos(t), 10, 20 * Math.sin(t)],
      [0, 2.5, 0],
      [0, 1, 0],
    );
  },

  // We set the lod uniform to be the fractional LOD
  lod: (_, { lod }) => lod - Math.floor(lod),

  // Finally we only draw as many primitives as are present in the finish LOD
  count: (_, { lod }) => 2 * lodOffsets[Math.floor(lod)],
};

export default () => (
  <ReglContainer onMount={onMount}>
    <Frame onUpdate={onUpdate}>
      <Drawable
        frag={frag}
        vert={vert}
        attributes={attributes}
        elements={lodCells}
        uniforms={uniforms}
      />
    </Frame>
  </ReglContainer>
);
