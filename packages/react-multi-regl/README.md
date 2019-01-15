# React Multi-Regl

[![Stability](https://img.shields.io/badge/Stability-Experimental-Orange.svg)](https://nodejs.org/api/documentation.html#documentation_stability_index)
[![npm](https://img.shields.io/npm/v/@psychobolt/react-multi-regl.svg)](https://www.npmjs.com/package/@psychobolt/react-multi-regl)
[![Build Status](https://travis-ci.org/psychobolt/react-regl.svg?branch=master)](https://travis-ci.org/psychobolt/react-regl)
[![codecov](https://codecov.io/gh/psychobolt/react-regl/branch/master/graph/badge.svg)](https://codecov.io/gh/psychobolt/react-regl)

[![Dependencies Status](https://david-dm.org/psychobolt/react-regl/status.svg?path=packages/react-multi-regl)](https://david-dm.org/psychobolt/react-regl?path=packages/react-multi-regl)
[![Dev Dependencies Status](https://david-dm.org/psychobolt/react-regl/dev-status.svg?path=packages/react-multi-regl)](https://david-dm.org/psychobolt/react-regl?path=packages/react-multi-regl&type=dev)
[![Peer Dependencies Status](https://david-dm.org/psychobolt/react-regl/peer-status.svg?path=packages/react-multi-regl)](https://david-dm.org/psychobolt/react-regl?path=packages/react-multi-regl&type=peer)

A [react-regl](https://github.com/psychobolt/react-regl) container and renderer with [multi-regl](https://github.com/regl-project/multi-regl) support.

## Install

> Recommended: (react|react-dom)@16.7.x, regl@1.13.x, and multi-regl@1.1.1

```sh
npm install --save @psychobolt/react-regl @psychobolt/react-multi-regl
# or
yarn add @psychobolt/react-regl @psychobolt/react-multi-regl
```

## Examples

See [demos](https://psychobolt.github.io/react-regl?selectedKind=Core%2Freact-multi-regl%2FSetup&selectedStory=Readme). Also check out their [sources](https://github.com/psychobolt/react-regl/blob/master/stories/packages/react-multi-regl). Here is one to get you started:

```jsx
import React from 'react';
import { View, Frame } from '@psychobolt/react-regl';
import { MultiReglContainer } from '@psychobolt/react-multi-regl';

import Subviews, { VIEW_COUNT, onFrame } from './Subviews';

<MultiReglContainer View={Subviews} viewCount={VIEW_COUNT}>
  {views => views.map((view, i) => <View element={view}><Frame onFrame={onFrame[i]} /></View>)}
</MultiReglContainer>
```

Subview component recieves a ref prop from MultiReglContainer. This allows the use of a child function, to create sub context for each view. How the ref prop is forwarded to each sub view depends on the Subiews component implementation.

## Components

### MultiReglContainer

Extends [ReglContainer](https://github.com/psychobolt/react-regl/blob/master/src/README.md#reglcontainer) with a multi-regl renderer and provides view elements. See example above.

#### Props

##### ```viewCount?: number```

The container will pause mounting the children until the collected view count is greater than this number. Default value is -1 (mount immediately).

### Types

#### View

Creates a sub context which is passed down to its children.

##### Props

> Remaining props are passed to regl as [initialization](http://regl.party/api#initialization) options.

###### ```element: Element```

A reference to a DOM object.

## API

### MultiReglRenderer

Extends [ReglRenderer](https://github.com/psychobolt/react-regl/blob/master/src/README.md#reglrenderer).
