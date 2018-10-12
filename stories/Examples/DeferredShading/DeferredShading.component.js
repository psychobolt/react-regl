// @flow
import * as React from 'react';
import { Frame, Drawable } from '@psychobolt/react-regl';
import attachCamera from 'canvas-orbit-camera';
import mat4 from 'gl-mat4';

import ReglContainer from 'stories/Setup/Resizable';

import DirectionalLight from './DirectionalLight';
import PointLights from './PointLights';
import Bunnies from './Bunnies';
import Box from './Box';
import frag from './DeferredShading.frag';
import vert from './DeferredShading.vert';

const contextProps = {
  extensions: ['webgl_draw_buffers', 'oes_texture_float'],
};

const S = 800; // plane size
const T = 0.1; // plane thickness
const C = [0.45, 0.45, 0.45]; // plane color

type Props = {};

type State = {
  fbo: any,
  uniforms: {},
};

export default class DeferredShading extends React.Component<Props, State> {
  state = {};

  onMount = ({ regl, view }) => {
    const camera = attachCamera(view);
    // configure initial camera view
    camera.rotate([0.0, 0.0], [0.0, -0.4]);
    camera.zoom(500.0); // 10.0

    this.camera = camera;

    this.setState({
      fbo: regl.framebuffer({
        color: [
          regl.texture({ type: 'float' }), // albedo
          regl.texture({ type: 'float' }), // normal
          regl.texture({ type: 'float' }), // position
        ],
        depth: true,
      }),
      uniforms: {
        view: () => camera.view(),
        projection: ({ viewportWidth, viewportHeight }) => mat4.perspective(
          [],
          Math.PI / 4,
          viewportWidth / viewportHeight,
          0.01,
          2000,
        ),
      },
    });

    this.clear = () => regl.clear({
      color: [0, 0, 0, 255],
      depth: 1,
    });
  };

  onFrame = ({ viewportWidth, viewportHeight }) => {
    const { fbo } = this.state;
    fbo.resize(viewportWidth, viewportHeight);
    this.camera.tick();
  };

  render() {
    const { fbo, uniforms } = this.state;
    return (
      <ReglContainer contextProps={contextProps} onMount={this.onMount}>
        {fbo && (
          <Frame onFrame={this.onFrame}>
            <Drawable uniforms={uniforms}>
              {/*
                First we draw all geometry, and output their normals,
                positions and albedo colors to the G-buffer
              */}
              <Drawable frag={frag} vert={vert} framebuffer={fbo}>
                <Drawable render={this.clear} />
                <Bunnies planeSize={S} />
                <Box scale={S} translate={T} color={C} />
              </Drawable>
              {/*
                We have a single directional light in the scene.
                We draw it as a full-screen pass.
              */}
              <DirectionalLight fbo={fbo} />
              {/* next, we draw all point lights as spheres. */}
              <PointLights fbo={fbo} />
            </Drawable>
          </Frame>
        )}
      </ReglContainer>
    );
  }
}
