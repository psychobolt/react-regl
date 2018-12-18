import React from 'react';
import { Drawable } from '@psychobolt/react-regl';

import frag from './Depth.frag';
import vert from './Depth.vert';

export default props => <Drawable frag={frag} vert={vert} {...props} />;
