import React from 'react';
import { Drawable } from '@psychobolt/react-regl';

const props = {
  depth: {
    mask: false,
    enable: true,
    func: '<=',
  },
  // setup stencil buffer.
  stencil: {
    enable: true,
    mask: 0xff,
    // If the stencil value at the fragment is not zero,
    // then by Carmack's reverse, the fragment is in the shadow!
    func: {
      cmp: '!=',
      ref: 0,
      mask: 0xff,
    },
    // do no writing to stencil buffer in this pass.
    // we already did that in the previous pass.
    op: {
      fail: 'keep',
      zfail: 'keep',
      pass: 'keep',
    },
  },
  // DO write to color buffer.
  colorMask: [true, true, true, true],
  cull: {
    enable: true,
    face: 'back',
  },
};

export default rest => <Drawable {...props} {...rest} />;
