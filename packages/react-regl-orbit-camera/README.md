# React Regl Orbit Camera

[![Stability](https://img.shields.io/badge/Stability-Experimental-Orange.svg)](https://nodejs.org/api/documentation.html#documentation_stability_index)
[![npm](https://img.shields.io/npm/v/@psychobolt/react-regl-orbit-camera.svg)](https://www.npmjs.com/package/@psychobolt/react-regl-orbit-camera)
[![Build Status](https://travis-ci.org/psychobolt/react-regl.svg?branch=master)](https://travis-ci.org/psychobolt/react-regl)
[![codecov](https://codecov.io/gh/psychobolt/react-regl/branch/master/graph/badge.svg)](https://codecov.io/gh/psychobolt/react-regl)

[![Dependencies Status](https://david-dm.org/psychobolt/react-regl/status.svg?path=packages/react-regl-orbit-camera)](https://david-dm.org/psychobolt/react-regl?path=packages/react-regl-orbit-camera)
[![Dev Dependencies Status](https://david-dm.org/psychobolt/react-regl/dev-status.svg?path=packages/react-regl-orbit-camera)](https://david-dm.org/psychobolt/react-regl?path=packages/react-regl-orbit-camera&type=dev)
[![Peer Dependencies Status](https://david-dm.org/psychobolt/react-regl/peer-status.svg?path=packages/react-regl-orbit-camera)](https://david-dm.org/psychobolt/react-regl?path=packages/react-regl-orbit-camera&type=peer)

Configurable orbit camera model and controls for react-regl.

## Install

```sh
npm install --save @psychobolt/react-regl-orbit-camera
# or
yarn add @psychobolt/react-regl-orbit-camera
```

## Examples

See [demos](https://psychobolt.github.io/react-regl/?selectedKind=packages%2Freact-regl-orbit-camera&selectedStory=Readme). Also check out their [sources](https://github.com/psychobolt/react-regl/blob/master/stories/packages/react-regl-orbit-camera). Here is one to get you started:

```jsx
import React from 'react';
import { ReglContainer, Frame } from '@psychobolt/react-regl';
import Camera from '@psychobolt/react-regl-orbit-camera';

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
```

The above wraps the view with orbit controls with the bunny's position (0, 2.5, 0). The Camera component computes on control actions (orbit/dolly) and passes the ```projection``` and ```view``` model matrices to regl's context. Holding left mouse and dragging will orbit the camera around the rabbit. Scrolling the mouse wheel will dolly the camera.

## Components

### Camera

#### Props

##### ```center?: number[] | number```

The position of the camera. Default value is ```[3, 3, 3]```.

##### ```theta?: number```

The initial latitude angle in radians. Default value is ```0```.

##### ```phi?: number```

The initial longitude angle in radians. Value should be between ```-Math.PI / 2``` and ```Math.PI / 2```. Default value is ```0```.

##### ```distance? number```

The initial distance from the target. Value should be between ```minDistance``` and ```maxDistance```. Default value is ```10```.

##### ```up?: number[]```

The up direction of the camera. The default value is ```[0, 1, 0]```.

##### ```minDistance?: number```

How far the camera can dolly in. The default value is ```0.1```.

##### ```maxDistance?: number```

How far the camera can dolly out. The default value is ```1000```.

## Credits

Credits goes to [Mikola Lysenko](https://github.com/mikolalysenko) for the simplified [implementation](https://github.com/regl-project/regl/blob/master/example/util/camera.js) of [regl-camera](https://github.com/regl-project/regl-camera).