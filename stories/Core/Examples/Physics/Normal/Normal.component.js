// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

import frag from './Normal.frag';
import vert from './Normal.vert';

const { Drawable } = ReactRegl;

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
