# React Regl

[![Stability](https://img.shields.io/badge/Stability-Experimental-Orange.svg)](https://nodejs.org/api/documentation.html#documentation_stability_index)
[![npm](https://img.shields.io/npm/v/@psychobolt/react-regl.svg)](https://www.npmjs.com/package/@psychobolt/react-regl)
[![Build Status](https://travis-ci.org/psychobolt/react-regl.svg?branch=master)](https://travis-ci.org/psychobolt/react-regl)
[![codecov](https://codecov.io/gh/psychobolt/react-regl/branch/master/graph/badge.svg?flag=react-regl)](https://codecov.io/gh/psychobolt/react-regl)

[![Dependencies Status](https://david-dm.org/psychobolt/react-regl.svg)](https://david-dm.org/psychobolt/react-regl)
[![Dev Dependencies Status](https://david-dm.org/psychobolt/react-regl/dev-status.svg)](https://david-dm.org/psychobolt/react-regl?type=dev)
[![Peer Dependencies Status](https://david-dm.org/psychobolt/react-regl/peer-status.svg)](https://david-dm.org/psychobolt/react-regl?type=peer)

React fiber renderer and custom container for [regl](https://github.com/regl-project/regl)

## Install

> Recommended: (react|react-dom) @ 16.13.x and regl @ 1.6.x.

```sh
npm install @psychobolt/react-regl
# or
yarn add @psychobolt/react-regl
```

## Example

There are several [demos](https://psychobolt.github.io/react-regl). Also check out their [sources](https://github.com/psychobolt/react-regl/blob/master/stories/Core). Here is one to get you started:

```jsx
import React from 'react';

import { ReglContainer, Drawable } from '@psychobolt/react-regl';

import frag from './Basic.frag';
import vert from './Basic.vert';

const clear = ({ regl }) => regl.clear({
  color: [0, 0, 0, 1],
  depth: 1,
});

const attributes = {
  position: [[-1, 0], [0, -1], [1, 1]],
};

const uniforms = {
  color: [1, 0, 0, 1],
};

export default () => (
  <ReglContainer onMount={clear}>
    <Drawable
      frag={frag}
      vert={vert}
      attributes={attributes}
      uniforms={uniforms}
      count={3}
    />
  </ReglContainer>
);
```

Please see [API Documentation](https://github.com/psychobolt/react-regl/blob/master/src/README.md) for more details.

## Extensions

See [packages](https://github.com/psychobolt/react-regl/tree/master/packages).
