// @flow
import * as React from 'react';
import { Drawable } from '@psychobolt/react-regl';

import frag from './Normal.frag';
import vert from './Normal.vert';

type Props = {
  children: React.Node
};

export default ({ children }: Props) => (
  <Drawable
    frag={frag}
    vert={vert}
  >
    {children}
  </Drawable>
);
