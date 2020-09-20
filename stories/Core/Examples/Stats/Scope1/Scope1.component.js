// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';
import mat4 from 'gl-mat4';

import frag from './Scope1.frag';
import vert from './Scope1.vert';

const { Drawable } = ReactRegl;

const cull = {
  enable: true,
};

const projection = ({ viewportWidth, viewportHeight }) => mat4.perspective(
  [],
  Math.PI / 4,
  viewportWidth / viewportHeight,
  0.01,
  2000,
);

type Props = {
  view: () => number[]
};

export default React.forwardRef<Props, typeof Drawable>(({ view, ...props }: Props, ref) => (
  <Drawable
    ref={ref}
    cull={cull}
    uniforms={{
      // View Projection matrices.
      view,
      projection,
      // light settings. These can of course be tweaked to your likings.
      lightDir: [0.39, 0.87, 0.29],
      ambientLightAmount: 0.3,
      diffuseLightAmount: 0.7,
    }}
    frag={frag}
    vert={vert}
    {...(props: $Rest<Props, any>)}
  />
));
