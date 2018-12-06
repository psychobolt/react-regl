import React from 'react';
import { Drawable } from '@psychobolt/react-regl';

import frag from './Outline.frag';
import vert from './Outline.vert';

const depth = {
  enable: true,
  mask: false, // DONT write to the depth buffer!
};

export default props => <Drawable frag={frag} vert={vert} depth={depth} {...props} />;
