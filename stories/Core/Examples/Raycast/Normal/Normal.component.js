import React from 'react';
import { Drawable } from '@psychobolt/react-regl';

import frag from './Normal.frag';
import vert from './Normal.vert';

export default props => <Drawable frag={frag} vert={vert} {...props} />;
