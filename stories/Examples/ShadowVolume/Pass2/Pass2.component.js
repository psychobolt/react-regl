import React from 'react';
import { Drawable } from '@psychobolt/react-regl';

const props = {
  depth: {
    mask: false, // don't write to depth buffer
    enable: true, // but DO use the depth test!
    func: '<',
  },
  // setup stencil buffer.
  stencil: {
    enable: true,
    mask: 0xff,
    func: {
      // stencil test always passes.
      // since we are only writing to the stencil buffer in this pass.
      cmp: 'always',
      ref: 0,
      mask: 0xff,
    },
    // as can be seen, basically we are doing Carmack's reverse.
    opBack: {
      fail: 'keep',
      zfail: 'increment wrap',
      zpass: 'keep',
    },
    opFront: {
      fail: 'keep',
      zfail: 'decrement wrap',
      zpass: 'keep',
    },
  },
  // do no culling. This means that we can write to the stencil
  // buffer in a single pass!. So we handle both the backfaces and the frontfaces
  // in this pass.
  cull: {
    enable: false,
  },
  // don't write to color buffer.
  colorMask: [false, false, false, false],
};

export default rest => <Drawable {...props} {...rest} />;
