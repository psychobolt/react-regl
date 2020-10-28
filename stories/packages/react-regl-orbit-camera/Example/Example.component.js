import React from 'react';
import { Frame } from '@psychobolt/react-regl';
import Camera from '@psychobolt/react-regl-orbit-camera';
import ReglContainer from 'stories/Core/Setup/Resizable';

import Bunny from './Bunny';

const clear = ({ regl }) => regl.clear({
  color: [0, 0, 0, 1],
});

const center = [0, 2.5, 0];

const contextProps = {
  extensions: 'oes_standard_derivatives',
};

export default () => {
  const [wireframe, useWireframe] = React.useState(false);
  return (
    <div>
      <button type="button" onClick={() => useWireframe(!wireframe)}>Toggle Wireframe</button>
      <ReglContainer contextProps={contextProps}>
        <Frame onFrame={clear}>
          <Camera center={center}>
            <Bunny wireframe={wireframe} />
          </Camera>
        </Frame>
      </ReglContainer>
    </div>
  );
};
