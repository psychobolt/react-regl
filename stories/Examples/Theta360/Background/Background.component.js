import React from 'react';

import { Drawable } from '@psychobolt/react-regl';

import vert from './Background.vert';

const attributes = {
  position: [
    -4, -4,
    -4, 4,
    8, 0,
  ],
};

const depth = {
  mask: false,
  enable: false,
};

export default () => (
  <Drawable
    vert={vert}
    attributes={attributes}
    depth={depth}
    count={3}
  />
);
