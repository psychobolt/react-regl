import React from 'react';
import { Drawable } from '@psychobolt/react-regl';

const props = {
  // use depth-buffer as usual.
  depth: {
    enable: true,
    mask: true,
    func: '<=',
  },
  // no stencil test
  stencil: {
    enable: false,
  },
  // turn on color white
  colorMask: [true, true, true, true],
  // cull back-faces as usual.
  cull: {
    enable: true,
    face: 'back',
  },
};

export default rest => <Drawable {...props} {...rest} />;
