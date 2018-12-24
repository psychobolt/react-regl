import React from 'react';
import { Drawable } from '@psychobolt/react-regl';

/*
  Setup rendering to stencil buffer.
*/
const stencil = {
  enable: true,
  mask: 0xff,
  // if a fragment is covered, set that fragment to 1 in the stencil buffer.
  func: {
    cmp: 'always',
    ref: 1,
    mask: 0xff,
  },
  opFront: {
    fail: 'replace',
    zfail: 'replace',
    zpass: 'replace',
  },
};

// we want to write only to the stencil buffer,
// so disable these masks.
const colorMask = [false, false, false, false];

const depth = {
  enable: true,
  mask: false,
};

export default props => (
  <Drawable
    stencil={stencil}
    colorMask={colorMask}
    depth={depth}
    {...props}
  />
);
