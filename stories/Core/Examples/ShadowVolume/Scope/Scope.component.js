import React from 'react';
import { Drawable } from '@psychobolt/react-regl';

import frag from './Scope.frag';

export default props => <Drawable frag={frag} {...props} />;
