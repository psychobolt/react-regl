import React from 'react';
import { Context, Frame } from '@psychobolt/react-regl';
import ReglContainer from 'stories/Setup/Resizable';


import Bunny from './Bunny';
import Camera from '../shared/Camera';

const clear = ({ regl }) => regl.clear({
  color: [0, 0, 0, 1],
});

export default () => (
  <ReglContainer>
    <Frame onFrame={clear}>
      <Context.Consumer>
        {({ context, mergeProps }) => (
          <Camera center={[0, 2.5, 0]} regl={context.regl} mergeProps={mergeProps}>
            <Bunny />
          </Camera>
        )}
      </Context.Consumer>
    </Frame>
  </ReglContainer>
);
