export const VERTEX_TEXTURE_SIZE = 64;

export const FIELD_RES = 1024;

export function vertexIndex(v) {
  return [v % VERTEX_TEXTURE_SIZE, (v / VERTEX_TEXTURE_SIZE) | 0];
}

function indexVertex(i, j) {
  return i + j * VERTEX_TEXTURE_SIZE;
}

// Initialize vertex data
export const VERTEX_COUNT = VERTEX_TEXTURE_SIZE * VERTEX_TEXTURE_SIZE;
const vertexStateData = new Float32Array(4 * VERTEX_COUNT);
const vertexIds = new Float32Array(2 * VERTEX_COUNT);
for (let i = 0; i < VERTEX_TEXTURE_SIZE; i += 1) {
  for (let j = 0; j < VERTEX_TEXTURE_SIZE; j += 1) {
    const ptr = VERTEX_TEXTURE_SIZE * i + j;
    vertexIds[2 * ptr] = i / VERTEX_TEXTURE_SIZE;
    vertexIds[2 * ptr + 1] = j / VERTEX_TEXTURE_SIZE;

    // Initial configuration of vertices
    vertexStateData[4 * ptr] = Math.random();
    vertexStateData[4 * ptr + 1] = Math.random();
  }
}
export const VERTEX_STATE_DATA = vertexStateData;
export const VERTEX_IDS = vertexIds;

// Initialize edges
const arcs = [];
function edge(si, sj, ti, tj) {
  const s = indexVertex(si, sj);
  const t = indexVertex(ti, tj);
  arcs.push([s, t], [t, s]);
}
for (let i = 0; i < VERTEX_TEXTURE_SIZE; i += 1) {
  for (let j = 0; j < VERTEX_TEXTURE_SIZE; j += 1) {
    if (i < VERTEX_TEXTURE_SIZE - 1) {
      edge(i, j, i + 1, j);
    }
    if (j < VERTEX_TEXTURE_SIZE - 1) {
      edge(i, j, i, j + 1);
    }
  }
}
export const ARCS = arcs;
