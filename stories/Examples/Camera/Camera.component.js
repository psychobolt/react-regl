import React from 'react';
import { Frame } from '@psychobolt/react-regl';
import ReglContainer from 'stories/Setup/Resizable';


import Bunny from './Bunny';
import Camera from '../shared/Camera';

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
