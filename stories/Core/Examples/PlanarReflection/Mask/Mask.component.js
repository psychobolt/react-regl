// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

const { Drawable } = ReactRegl;

const stencil = {
  enable: true,
  mask: 0xff,
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

type Props = {
  children: React.Node,
};

export default (({ children }: Props) => (
  <Drawable stencil={stencil} colorMask={colorMask} depth={depth}>
    {children}
  </Drawable>
): React.AbstractComponent<Props>);
