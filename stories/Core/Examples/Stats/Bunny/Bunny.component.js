import React from 'react';
import { Drawable } from '@psychobolt/react-regl';
import normals from 'angle-normals';
import bunny from 'bunny';

import { createModel } from '../shared';

const attributes = {
  position: bunny.positions,
  normal: normals(bunny.cells, bunny.positions),
};

const uniforms = {
  model: (_, { position, scale }) => createModel(position, scale),
  color: [0.5, 0.0, 0.0],
};

export default React.forwardRef((props, ref) => (
  <Drawable
    ref={ref}
    attributes={attributes}
    elements={bunny.cells}
    uniforms={uniforms}
    {...props}
  />
));
