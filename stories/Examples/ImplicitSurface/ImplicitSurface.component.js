import React from 'react';
import { ReglContainer, Context, Frame, Drawable } from '@psychobolt/react-regl';

import vert from './ImplicitSurface.vert';
import frag from './ImplicitSurface.frag';
import Camera from '../shared/Camera';

const center = [-12, 5, 1];

const attributes = {
  position: [-4, -4, 4, -4, 0, 4],
};

export default () => (
  <ReglContainer>
    <Context.Consumer>
      {({ context }) => (
        <Frame>
          <Camera center={center} phi={-0.2}>
            <Drawable
              vert={vert}
              frag={frag}
              attributes={attributes}
              uniforms={{
                height: context.regl.context('viewportHeight'),
                width: context.regl.context('viewportWidth'),
                timestep: context.regl.context('tick'),
              }}
              count={3}
            />
          </Camera>
        </Frame>
      )}
    </Context.Consumer>
  </ReglContainer>
);
