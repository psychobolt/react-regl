import React from 'react';
import { Drawable } from '@psychobolt/react-regl';

const uniforms = {
  ambientLightAmount: 0.15,
  diffuseLightAmount: 0.35,
};

export default React.forwardRef((props, ref) => (
  <Drawable ref={ref} uniforms={uniforms} {...props} />
));
