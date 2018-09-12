import React from 'react';
import attachCamera from 'canvas-orbit-camera';
import mat4 from 'gl-mat4';

import { Context, Drawable, Resource, Frame } from 'src';
import ReglContainer from 'stories/Setup/Resizable';

import Terrain from './Terrain';
import Bunny from './Bunny';
import frag from './Blur.frag';
import vert from './Blur.vert';
import texturePlane from './textureplane.png';
import rockTex from './rock_texture.png';

let camera;
let fbo;

const onMount = ({ view, regl }) => {
  camera = attachCamera(view);

  // configure intial camera view.
  camera.rotate([0.0, 0.0], [0.0, -0.4]);
  camera.zoom(300.0);

  // create fbo. We set the size in `regl.frame`
  fbo = regl.framebuffer({
    color: regl.texture({
      width: 1,
      height: 1,
      wrap: 'clamp',
    }),
    depth: true,
  });
};

// geometry arrays.
const elements = [];
const xzPosition = [];

const N = 64; // num quads of the plane

const size = 0.5;
const xmin = -size;
const xmax = +size;
const ymin = -size;
const ymax = +size;

/*
  For the terrain geometry, we create a plane with min position as (x=-0.5,z=-0.5) and max position
  as (x=+0.5, z=+0.5).

  In the vertex shader, we enlarge this plane on the x-axis and z-axis. And the y-values are sampled
  from the heightmap texture,

  The uv-coordinates are computed from the positions.
  The normals can be approximated from the heightmap texture and the positions.

  So we only have to upload the x- and z-values and the heightmap texture to the GPU, and nothing
  else.
*/
let row;
let col;
for (row = 0; row <= N; row += 1) {
  const z = (row / N) * (ymax - ymin) + ymin;
  for (col = 0; col <= N; col += 1) {
    const x = (col / N) * (xmax - xmin) + xmin;
    xzPosition.push([x, z]);
  }
}

// create plane faces.
for (row = 0; row <= (N - 1); row += 1) {
  for (col = 0; col <= (N - 1); col += 1) {
    const i = row * (N + 1) + col;

    const i0 = i + 0;
    const i1 = i + 1;
    const i2 = i + (N + 1) + 0;
    const i3 = i + (N + 1) + 1;

    elements.push([i3, i1, i0]);
    elements.push([i0, i2, i3]);
  }
}

/*
  Encapsulate all the state that is common between terrain and bunny
*/
const cull = {
  enable: true,
};

const commonUniforms = {
  // View Projection matrices.
  view: () => camera.view(),
  projection: ({ viewportWidth, viewportHeight }) => mat4.perspective(
    [],
    Math.PI / 4,
    viewportWidth / viewportHeight,
    0.01,
    3000,
  ),
  // light settings. These can of course be tweaked to your likings.
  lightDir: [0.39, 0.87, 0.29],
  ambientLightAmount: 0.3,
  diffuseLightAmount: 0.7,
};

const attributes = {
  position: [-4, -4, 4, -4, 0, 4],
};

const uniforms = {
  tex: () => fbo,
  wRcp: ({ viewportWidth }) => 1.0 / viewportWidth,
  hRcp: ({ viewportHeight }) => 1.0 / viewportHeight,
};

const depth = { enable: false };

const onFrame = ({ viewportWidth, viewportHeight }) => {
  /*
    We need to set the FBO size in `regl.frame`, because the viewport size will change if the user
    resizes the browser window.

    However, note that regl is clever, and will only actually resize the fbo when the viewport size
    actually changes!
  */
  fbo.resize(viewportWidth, viewportHeight);
};

export default () => (
  <ReglContainer onMount={onMount}>
    <Context.Consumer>
      {({ context }) => (
        <Resource
          manifest={{
            heightTexture: {
              type: 'image',
              src: texturePlane,
              parser: data => context.regl.texture({
                data,
              }),
            },
            rockTexture: {
              type: 'image',
              src: rockTex,
              parser: data => context.regl.texture({
                data,
                wrap: 'repeat',
              }),
            },
          }}
        >
          {({ heightTexture, rockTexture }) => (
            <Frame onFrame={onFrame}>
              {/* begin render to FBO */}
              <Drawable
                cull={cull}
                uniforms={commonUniforms}
                framebuffer={fbo}
              >
                <Drawable render={() => context.regl.clear({
                  color: [0, 0, 0, 255],
                  depth: 1,
                })}
                />
                <Terrain
                  heightTexture={context.regl.prop('heightTexture')}
                  rockTexture={context.regl.prop('rockTexture')}
                  xzPosition={context.regl.prop('xzPosition')}
                  elements={context.regl.prop('elements')}
                  args={{ elements, xzPosition, heightTexture, rockTexture }}
                />
                <Bunny color={context.regl.prop('color')} />
              </Drawable>
              {/* end render to FBO */}
              <Drawable render={() => context.regl.clear({
                color: [0, 0, 0, 255],
                depth: 1,
              })}
              />
              {/* Now render fbo to quad, but also blur it */}
              <Drawable
                frag={frag}
                vert={vert}
                attributes={attributes}
                uniforms={uniforms}
                depth={depth}
                count={3}
              />
              <Drawable render={() => camera.tick()} />
            </Frame>
          )}
        </Resource>
      )}
    </Context.Consumer>
  </ReglContainer>
);
