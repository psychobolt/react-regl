import React from 'react';
import { Context, Frame, Drawable } from '@psychobolt/react-regl';
import ReglContainer from 'stories/Setup/Resizable';
import attachCamera from 'canvas-orbit-camera';
import mat4 from 'gl-mat4';

import Pass1 from './Pass1';
import Pass2 from './Pass2';
import Pass3 from './Pass3';
import { Plane, Rabbit } from './Models';
import Scope from './Scope';
import Silhouette from './Silhouette';
import Caps from './Caps';

// The mesh data of the shadow-casting rabbit
/*
  the mesh-data of the bunny was created by this script:
  https://github.com/stackgl/webgl-workshop/blog/master/exercises/stencil-shadows/data/prepare.js
*/
import DATA from './Models/Rabbit/shadow_bunny.json'; // Ideally, data should be loaded dynamically as a React resource object.

let camera;
let meshBuffer;
let shadowBuffer;

function onMount({ view, regl }) {
  camera = attachCamera(view);
  camera.rotate([0.0, 0.0], [0.0, -0.4]);
  camera.zoom(-28.0);

  meshBuffer = regl.buffer(DATA.MESH);
  shadowBuffer = regl.buffer(DATA.SHADOW);
}

function ref(canvas) {
  ref.current = canvas ? canvas.getContext('webgl', {
    antialias: true,
    stencil: true,
  }) : null;
}

const viewProps = {
  ref,
};

const uniforms = {
  lightDir: () => [-0.39, -0.87, -0.29],

  // create the combined projection and view matrices.
  camera({ viewportWidth, viewportHeight }) {
    const fovy = Math.PI / 2;
    const aspect = viewportWidth / viewportHeight;
    const near = 0.01;
    const f = 1.0 / Math.tan(fovy / 2);
    const out = [];
    const eps = 1.0;

    /*
      Note that we do not use a normal perspective matrix.

      This projection matrix below is basically this matrix
      https://github.com/stackgl/gl-mat4/blob/master/perspective.js
      Except that we've let 'far' go to infinity,
      and that we add an epsilon factor at some places

      It is basically the matrix given in equation (8) of this article:
      http://www.gamesustra.com/view/feature/131351/the_mechanics_of_robust_stencil_php.?print=1
    */
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = -1 + eps;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (eps - 2) * near;
    out[15] = 0;

    return mat4.multiply([], out, camera.view());
  },
};

const rabbits = [];

// create model of lower rabbit ring
for (let i = 0; i <= 0.9; i += 0.1) {
  const theta = Math.PI * 2 * i;
  const rabbitArgs = ({ tick }) => {
    const phi0 = tick * 0.003;
    const model = mat4.identity([]);
    mat4.translate(
      model, model, [2.0 * Math.cos(theta + phi0), 0.6, 2.0 * Math.sin(theta + phi0)],
    );
    return { model };
  };
  rabbits.push(rabbitArgs);
}

// create model of upper rabbit ring.
for (let i = 0; i <= 0.9; i += 0.2) {
  const theta = Math.PI * 2 * i + 1.3;
  const rabbitArgs = ({ tick }) => {
    const phi0 = tick * 0.003;
    const model = mat4.identity([]);
    mat4.translate(
      model, model, [2.0 * Math.cos(theta + phi0 * 0.3), 1.3, 2.0 * Math.sin(theta + phi0 * 0.3)],
    );
    return { model };
  };
  rabbits.push(rabbitArgs);
}

const mPlane = mat4.identity([]);
mat4.translate(mPlane, mPlane, [0, 0, 0]);

const onFrame = () => camera.tick();

export default () => (
  <ReglContainer onMount={onMount} viewProps={viewProps}>
    <Context.Consumer>
      {({ context }) => (
        <Frame onFrame={onFrame}>
          <Drawable uniforms={uniforms}>
            <Drawable
              render={() => context.regl.clear({
                depth: 1,
                color: [0, 0, 0, 1],
              })}
            />
            {/* ----First pass: Draw mesh, no stencil buffer */}
            <Pass1>
              {rabbits.map((args, i) => <Rabbit key={`rabbit_${i + 1}`} buffer={meshBuffer} intensity={1.0} args={args} />)}
              <Plane intensity={1.0} model={mPlane} />
            </Pass1>
            {/* ----Second pass: Draw to stencil buffer */}
            <Pass2>
              <Drawable render={() => context.regl.clear({ stencil: 0 })} />
              <Scope>
                {rabbits.map((args, i) => [
                  <Silhouette key={`silhoutte_${i + 1}`} buffer={shadowBuffer} args={args} />,
                  <Caps key={`caps_${i + 1}`} buffer={meshBuffer} args={args} />,
                ])}
              </Scope>
            </Pass2>
            {/* ----Final pass: Draw mesh with shadows */}
            <Pass3>
              {/*
                to render the shadows, we render the meshes at the fragments that passes the
                stencil-test, but with a slightly darker color
              */}
              {rabbits.map((args, i) => <Rabbit key={`rabbit_${i + 1}`} buffer={meshBuffer} intensity={0.1} args={args} />)}
              <Plane intensity={0.1} model={mPlane} />
            </Pass3>
          </Drawable>
        </Frame>
      )}
    </Context.Consumer>
  </ReglContainer>
);
