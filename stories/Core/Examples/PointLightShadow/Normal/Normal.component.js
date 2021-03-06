// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';
import mat4 from 'gl-mat4';

import frag from './Normal.frag';
import vert from './Normal.vert';

const { Drawable } = ReactRegl;

const projection = ({ viewportWidth, viewportHeight }) => mat4
  .perspective([], Math.PI / 2, viewportWidth / viewportHeight, 0.01, 1000);

type Props = {
  view: () => number[],
  shadowFbo: any,
  children: React.Node,
};

export default (({ view, shadowFbo, children }: Props) => (
  <Drawable
    uniforms={{
      view,
      projection,
      shadowCube: shadowFbo,
    }}
    frag={frag}
    vert={vert}
  >
    {children}
  </Drawable>
): React.AbstractComponent<Props>);
