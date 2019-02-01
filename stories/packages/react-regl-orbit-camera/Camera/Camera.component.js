import React from 'react';
import { Frame } from '@psychobolt/react-regl';
import Camera from '@psychobolt/react-regl-orbit-camera';
import ReglContainer from 'stories/Core/Setup/Resizable';

import Bunny from './Bunny';

const clear = ({ regl }) => regl.clear({
  color: [0, 0, 0, 1],
});

const center = [0, 2.5, 0];

export default () => (
  <ReglContainer>
    <Frame onFrame={clear}>
      <Camera center={center}>
        <Bunny />
      </Camera>
    </Frame>
  </ReglContainer>
);
