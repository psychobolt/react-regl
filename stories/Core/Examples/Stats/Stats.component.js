import React from 'react';
import { Frame } from '@psychobolt/react-regl';
import ReglContainer from 'stories/Core/Setup/Resizable';
import attachCamera from 'canvas-orbit-camera';

import Scope1 from './Scope1';
import Scope2 from './Scope2';
import Scope3 from './Scope3';
import Plane from './Plane';
import Box from './Box';
import Bunny from './Bunny';

const contextProps = {
  extensions: 'EXT_disjoint_timer_query',
  profile: true,
};

const boxes = [];
const X_COUNT = 5;
const Z_COUNT = 5;

// place out boxes.
let SPACING = -100;
for (let x = 0; x < X_COUNT; x += 1) {
  for (let z = 0; z < Z_COUNT; z += 1) {
    boxes.push({ scale: 50.7, position: [-200.0 + x * SPACING, 40, 200 + z * SPACING] });
  }
}

SPACING = 100;
const bunnies = [];
for (let x = 0; x < X_COUNT; x += 1) {
  for (let z = 0; z < Z_COUNT; z += 1) {
    bunnies.push({ scale: 5.2, position: [x * SPACING, 3.3, -80.0 + z * SPACING] });
  }
}

const planeArgs = {
  scale: 2000.0,
  position: [0.0, 0.0, 0.0],
};

export default class Stats extends React.Component {
  onMount = ({ view }) => {
    this.camera = attachCamera(view);
    this.camera.rotate([0.0, 0.0], [0.0, -0.4]);
    this.camera.zoom(300.0);
  }

  onFrame = ({ regl }) => {
    regl.clear({
      color: [0, 0, 0, 255],
      depth: 1,
    });
    this.camera.tick();
  }

  view = () => this.camera.view();

  render() {
    return (
      <ReglContainer onMount={this.onMount} statsWidget contextProps={contextProps}>
        <Frame onFrame={this.onFrame}>
          <Scope1 name="Scope1" view={this.view}>
            <Scope2 name="Scope2">
              <Box name="Box" args={boxes} />
            </Scope2>
            <Scope3 name="Scope3">
              <Plane name="Plane" args={planeArgs} />
              <Bunny name="Bunny" args={bunnies} />
            </Scope3>
          </Scope1>
        </Frame>
      </ReglContainer>
    );
  }
}
