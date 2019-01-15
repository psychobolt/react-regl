import React from 'react';
import { Drawable } from '@psychobolt/react-regl';

import { createModel } from '../shared';

const elements = [
  [3, 1, 0],
  [0, 2, 3],
];

const positions = [
  [-0.5, 0.0, -0.5],
  [0.5, 0.0, -0.5],
  [-0.5, 0.0, 0.5],
  [0.5, 0.0, 0.5],
];

const normals = [
  [0.0, 1.0, 0.0],
  [0.0, 1.0, 0.0],
  [0.0, 1.0, 0.0],
  [0.0, 1.0, 0.0],
];

const uniforms = {
  color: [0.7, 0.7, 0.7],
  model: (_, { position, scale }) => createModel(position, scale),
};

const attributes = {
  position: positions,
  normal: normals,
};

export default React.forwardRef((props, ref) => (
  <Drawable
    ref={ref}
    uniforms={uniforms}
    attributes={attributes}
    elements={elements}
    {...props}
  />
));
