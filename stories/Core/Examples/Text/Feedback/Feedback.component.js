// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

import frag from './Feedback.frag';
import vert from './Feedback.vert';

const { Drawable } = ReactRegl;

const attributes = {
  position: [-2, 0, 0, -2, 2, 2],
};

const depth = {
  enable: false,
};

const t = ({ tick }) => 0.001 * tick;

type Props = {
  texture: Object,
};

export default ({ texture }: Props) => (
  <Drawable
    frag={frag}
    vert={vert}
    attributes={attributes}
    uniforms={{
      texture,
      t,
    }}
    depth={depth}
    count={3}
  />
);
