import React from 'react';
import { Frame } from '@psychobolt/react-regl';
import ReglContainer from 'stories/Setup/Resizable';
import Camera from 'stories/Examples/shared/Camera';

import Bunny from './Bunny';

const clear = ({ regl }) => regl.clear({
  color: [0, 0, 0, 1],
});

export default () => (
  <ReglContainer>
    <Frame onFrame={clear}>
      <Camera center={[0, 2.5, 0]}>
        <Bunny />
      </Camera>
    </Frame>
  </ReglContainer>
);
