import React from 'react';
import mouseChange from 'mouse-change';

import { ReglContainer, Context, Frame, Drawable } from '@psychobolt/react-regl';

import Camera from './Camera';
import CubeMap from './CubeMap';
import Bunny from './Bunny';
import Teapot from './Teapot';
import Ground from './Ground';

const CUBE_MAP_SIZE = 512;

let mouse;
let bunnyFBO;
let teapotFBO;

const onMount = ({ regl, view }) => {
  bunnyFBO = regl.framebufferCube(CUBE_MAP_SIZE);
  teapotFBO = regl.framebufferCube(CUBE_MAP_SIZE);

  mouse = mouseChange(view);
};

const teapotPos = [0, 3, 0];

const teapotArgs = {
  position: teapotPos,
};

const bunnyPos = [];

const onFrame = ({ tick }) => {
  const t = 0.01 * tick;
  bunnyPos[0] = 15.0 * Math.cos(t);
  bunnyPos[1] = -2.5;
  bunnyPos[2] = 15.0 * Math.sin(t);
};

const bunnyArgs = {
  position: bunnyPos,
};

const cameraArgs = ({ pixelRatio, drawingBufferWidth, drawingBufferHeight }) => {
  const theta = 2.0 * Math.PI * (pixelRatio * mouse.x / drawingBufferWidth - 0.5);
  return {
    eye: [
      20.0 * Math.cos(theta),
      30.0 * (0.5 - pixelRatio * mouse.y / drawingBufferHeight),
      20.0 * Math.sin(theta),
    ],
    target: [0, 0, 0],
  };
};

export default () => (
  <ReglContainer onMount={onMount}>
    <Frame onFrame={onFrame}>
      <Context.Consumer>
        {({ context }) => (
          <React.Fragment>
            {/* render teapot cube map */}
            <CubeMap fbo={teapotFBO} center={teapotPos}>
              <Drawable
                render={() => context.regl.clear({
                  color: [0.2, 0.2, 0.2, 1],
                  depth: 1,
                })}
              />
              <Ground />
              <Bunny fbo={bunnyFBO} args={bunnyArgs} />
            </CubeMap>
            {/* render bunny cube map */}
            <CubeMap fbo={bunnyFBO} center={bunnyPos}>
              <Drawable
                render={() => context.regl.clear({
                  color: [0, 0, 0, 1],
                  depth: 1,
                })}
              />
              <Ground />
              <Teapot fbo={teapotFBO} args={teapotArgs} />
            </CubeMap>
            <Camera args={cameraArgs}>
              <Drawable
                render={() => context.regl.clear({
                  color: [0, 0, 0, 1],
                  depth: 1,
                })}
              />
              <Ground />
              <Teapot fbo={teapotFBO} args={teapotArgs} />
              <Bunny fbo={bunnyFBO} args={bunnyArgs} />
            </Camera>
          </React.Fragment>
        )}
      </Context.Consumer>
    </Frame>
  </ReglContainer>
);
