# React Regl Mesh

[![Stability](https://img.shields.io/badge/Stability-Experimental-Orange.svg)](https://nodejs.org/api/documentation.html#documentation_stability_index)
[![npm](https://img.shields.io/npm/v/@psychobolt/react-regl-mesh.svg)](https://www.npmjs.com/package/@psychobolt/react-regl-mesh)
[![Build Status](https://travis-ci.org/psychobolt/react-regl.svg?branch=master)](https://travis-ci.org/psychobolt/react-regl)
[![codecov](https://codecov.io/gh/psychobolt/react-regl/branch/master/graph/badge.svg?flag=react-regl-mesh)](https://codecov.io/gh/psychobolt/react-regl/tree/master/packages/react-regl-mesh)

[![Dependencies Status](https://david-dm.org/psychobolt/react-regl/status.svg?path=packages/react-regl-mesh)](https://david-dm.org/psychobolt/react-regl?path=packages/react-regl-mesh)
[![Dev Dependencies Status](https://david-dm.org/psychobolt/react-regl/dev-status.svg?path=packages/react-regl-mesh)](https://david-dm.org/psychobolt/react-regl?path=packages/react-regl-mesh&type=dev)
[![Peer Dependencies Status](https://david-dm.org/psychobolt/react-regl/peer-status.svg?path=packages/react-regl-mesh)](https://david-dm.org/psychobolt/react-regl?path=packages/react-regl-mesh&type=peer)

Standardized shader attributes in [react-regl](https://github.com/psychobolt/react-regl).

## Install

> Recommended dependencies: [glsl-solid-wireframe @ 1.0.x](https://github.com/rreusser/glsl-solid-wireframe)

```sh
npm install --save @psychobolt/react-regl-mesh
# or
yarn add @psychobolt/react-regl-mesh
```

## Example

Render the bunny [mesh](#mesh) as a wireframe. See a interactive [demo](https://psychobolt.github.io/react-regl/?path=/story/packages-react-regl-orbit-camera--example) from the [react-regl-orbit-camera](https://github.com/psychobolt/react-regl/blob/master/packages/react-regl-orbit-camera) package.

```jsx
import React from 'react';
import { Mesh } from '@psychobolt/react-regl-mesh';

import bunny from 'bunny';
import vert from './Wireframe/Wireframe.vert';
import frag from './Wireframe/Wireframe.frag';

export default () => (
  <Mesh
    vert={vert}
    frag={frag}
    positions={bunny.positions}
    cells={mesh.cells}
    normals
    wireframe
  />
);
```

## Documentation

### Components

#### Mesh

Standardize mesh shader attributes for [Drawable](https://github.com/psychobolt/react-regl/tree/master/src#drawable).

```jsx
import React from 'react';
import { Mesh } from '@psychobolt/react';

import mesh, { vert, frag } from './Mesh';

export default () => (
  <Mesh
    vert={vert}
    frag={frag}
    positions={mesh.positions}
    cells={mesh.cells}
    normals
    wireframe
  />
);
```

##### Props

Inherits props from [Drawable](https://github.com/psychobolt/react-regl/tree/master/src#drawable).

##### ```positions: number[][]```

Access to the vertex shader attribute (```abtribute vec3 position```) .

##### ```cells: number[] | number[][]```

Analogous to ```elements```.

##### ```normals?: boolean | number[][]```

Enables the vertex shader attribute (```attribute vec3 normal```). If normal is a boolean, then the normals is calculated using ```cells``` and ```positions```.

##### ```wireframe?: boolean```

Access to the vertex shader attribute (```attribute vec2 barycentric```). Uses the [glsl-solid-wireframe](https://github.com/rreusser/glsl-solid-wireframe) library. __Note: OES_standard_derivatives extension is required.__