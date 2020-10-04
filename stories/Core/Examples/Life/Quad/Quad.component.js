// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

import frag from './Quad.frag';
import vert from './Quad.vert';

const { Drawable } = ReactRegl;

const attributes = {
  position: [-4, -4, 4, -4, 0, 4],
};

const depth = {
  enable: false,
};

type Props = {
  children: React.Node,
}

export default (({ children, ...props }: Props) => (
  <Drawable
    frag={frag}
    vert={vert}
    attributes={attributes}
    depth={depth}
    count={3}
    {...(props: $Rest<Props, any>)}
  >
    {children}
  </Drawable>
): React.AbstractComponent<Props>);
