// @flow
import React from 'react';
import { Drawable } from '@psychobolt/react-regl';
import mouseChange from 'mouse-change';

import vert from './SplatMouse.vert';
import frag from './SplatMouse.frag';

const mouse = mouseChange();

const attributes = { p: [0] };

const uniforms = {
  mouse: ({ drawingBufferWidth, drawingBufferHeight, pixelRatio }) => [
    2.0 * pixelRatio * mouse.x / drawingBufferWidth - 1.0,
    1.0 - 2.0 * pixelRatio * mouse.y / drawingBufferHeight,
  ],
  strength: () => (mouse.buttons ? 5.0 : 1.0),
};

export default () => (
  <Drawable
    vert={vert}
    frag={frag}
    attributes={attributes}
    uniforms={uniforms}
    count={1}
    primitive="points"
  />
);
