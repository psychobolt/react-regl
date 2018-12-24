import React from 'react';
import { Drawable } from '@psychobolt/react-regl';

// pass stencil test only if value in stencil buffer is 0.
const stencil = {
  enable: true,
  mask: 0xff,
  func: {
    cmp: 'equal',
    ref: 0,
    mask: 0xff,
  },
};

export default props => <Drawable stencil={stencil} {...props} />;
