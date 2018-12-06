import React from 'react';
import { Frame, Drawable } from '@psychobolt/react-regl';
import ReglContainer from 'stories/Setup/Resizable';
import mousePosition from 'mouse-position';
import mousePressed from 'mouse-pressed';
import mat4 from 'gl-mat4';
import vec3 from 'gl-vec3';
import normals from 'angle-normals';
import bunny from 'bunny';

import Mesh, { createModelMatrix } from './Mesh';
import Normal from './Normal';
import Outline from './Outline';

const viewMatrix = new Float32Array(
  [
    1,
    0,
    0,
    0,
    0,
    0.876966655254364,
    0.48055124282836914,
    0,
    0,
    -0.48055124282836914,
    0.876966655254364,
    0,
    0,
    0,
    -11.622776985168457,
    1,
  ],
);

const projectionMatrix = new Float32Array(16);

// Below is a slightly modified version of this code:
// https://github.com/substack/ray-triangle-intersection
// It does intersection between ray and triangle.
// With the original version, we had no way of accessing 't'
// But we really needed that value.
function intersectTriangle(out, pt, dir, tri) {
  const EPSILON = 0.000001;
  const edge1 = [0, 0, 0];
  const edge2 = [0, 0, 0];
  const tvec = [0, 0, 0];
  const pvec = [0, 0, 0];
  const qvec = [0, 0, 0];

  vec3.subtract(edge1, tri[1], tri[0]);
  vec3.subtract(edge2, tri[2], tri[0]);

  vec3.cross(pvec, dir, edge2);
  const det = vec3.dot(edge1, pvec);

  if (det < EPSILON) return null;
  vec3.subtract(tvec, pt, tri[0]);
  const u = vec3.dot(tvec, pvec);
  if (u < 0 || u > det) return null;
  vec3.cross(qvec, tvec, edge1);
  const v = vec3.dot(dir, qvec);
  if (v < 0 || u + v > det) return null;

  const t = vec3.dot(edge2, qvec) / det;
  /* eslint-disable no-param-reassign */
  out[0] = pt[0] + t * dir[0];
  out[1] = pt[1] + t * dir[1];
  out[2] = pt[2] + t * dir[2];
  /* eslint-enable no param-reassign */
  return t;
}

//
// Create plane geometry
//

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

//
// Create box geometry.
//

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
  lightDir: [0.39, 0.87, 0.29],
  view: () => viewMatrix,
  projection: ({ viewportWidth, viewportHeight }) => mat4.perspective(
    projectionMatrix,
    Math.PI / 4,
    viewportWidth / viewportHeight,
    0.01,
    1000,
  ),
};

const bunnyProps = {
  elements: bunny.cells,
  position: bunny.positions,
  normal: normals(bunny.cells, bunny.positions),
};
const boxProps = {
  elements: boxElements,
  position: boxPosition,
  normal: boxNormal,
};
const planeProps = {
  elements: planeElements,
  position: planePosition,
  normal: planeNormal,
};

const meshes = [
  { key: 'plane', args: { scale: 80.0, translate: [0.0, 0.0, 0.0] }, color: [0.5, 0.5, 0.5], ...planeProps },
  { key: 'bunny_1', args: { scale: 0.2, translate: [0.0, 0.0, 0.0] }, color: [0.6, 0.0, 0.0], ...bunnyProps },
  { key: 'bunny_2', args: { scale: 0.3, translate: [-6.0, 0.0, -3.0] }, color: [0.6, 0.6, 0.0], ...bunnyProps },
  { key: 'bunny_3', args: { scale: 0.16, translate: [3.0, 0.0, 2.0] }, color: [0.2, 0.5, 0.6], ...bunnyProps },
  { key: 'box_1', args: { scale: 2.0, translate: [4.0, 1.0, 0.0] }, color: [0.6, 0.0, 0.0], ...boxProps },
  { key: 'box_2', args: { scale: 1.3, translate: [-3.0, 0.6, -4.0] }, color: [0.0, 0.6, 0.0], ...boxProps },
  { key: 'box_3', args: { scale: 0.7, translate: [-3.0, 0.5, 4.0] }, color: [0.0, 0.0, 0.8], ...boxProps },
];

const onFrame = ({ regl }) => regl.clear({
  color: [0, 0, 0, 255],
  depth: 1,
});

export default class Raycast extends React.Component {
  state = {
    iSelectedMesh: -1,
  }

  onMount = ({ view }) => {
    const mp = mousePosition(view);
    const mb = mousePressed(view);

    // on click, we raycast
    mb.on('down', () => {
      const vp = mat4.multiply([], projectionMatrix, viewMatrix);
      const invVp = mat4.invert([], vp);

      // get a single point on the camera ray.
      const rayPoint = vec3.transformMat4(
        [],
        [2.0 * mp[0] / view.width - 1.0, -2.0 * mp[1] / view.height + 1.0, 0.0],
        invVp,
      );

      // get the position of the camera.
      const rayOrigin = vec3.transformMat4([], [0, 0, 0], mat4.invert([], viewMatrix));

      const rayDir = vec3.normalize([], vec3.subtract([], rayPoint, rayOrigin));

      // now we iterate through all meshes,
      // and find the closest mesh that intersects the camera ray.
      let minT = 10000000.0;
      for (let i = 0; i < meshes.length; i += 1) {
        const m = meshes[i];

        const modelMatrix = createModelMatrix(m.args);

        // we must check all triangles of the mesh.
        for (let j = 0; j < m.elements.length; j += 1) {
          if (m.elements === planeElements) {
            continue; // eslint-disable-line no-continue, we don't allow clicking the plane mesh
          }
          const f = m.elements[j];
          // apply model matrix on the triangle.
          const tri = [
            vec3.transformMat4([], m.position[f[0]], modelMatrix),
            vec3.transformMat4([], m.position[f[1]], modelMatrix),
            vec3.transformMat4([], m.position[f[2]], modelMatrix),
          ];
          const res = [];
          const t = intersectTriangle(res, rayPoint, rayDir, tri);
          if (t !== null) {
            if (t < minT) {
              // mesh was closer than any object thus far.
              // for the time being, make it the selected object.
              minT = t;
              this.setState({ iSelectedMesh: i });
              break;
            }
          }
        }
      }
    });
  }

  render() {
    const { iSelectedMesh } = this.state;
    const unselected = iSelectedMesh > 0 ? meshes.filter((mesh, i) => i !== iSelectedMesh) : meshes;
    const selected = iSelectedMesh > 0 ? [meshes[iSelectedMesh]] : [];
    return (
      <ReglContainer onMount={this.onMount}>
        <Frame onFrame={onFrame}>
          <Drawable uniforms={uniforms}>
            {/* draw objects normally */}
            {unselected.map(props => <Normal key={`${props.key}_normal`}><Mesh {...props} /></Normal>)}
            {/* we need to render the selected object last */}
            {selected.map(props => [
              <Outline key={`${props.key}_outline`}><Mesh isRound={props.elements !== boxElements} {...props} /></Outline>,
              <Normal key={`${props.key}_normal`}><Mesh {...props} /></Normal>,
            ])}
          </Drawable>
        </Frame>
      </ReglContainer>
    );
  }
}
