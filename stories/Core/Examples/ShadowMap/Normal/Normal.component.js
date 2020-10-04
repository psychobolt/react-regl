// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';
import mat4 from 'gl-mat4';

import frag from './Normal.frag';
import vert from './Normal.vert';

const { Drawable } = ReactRegl;

const projection = ({ viewportWidth, viewportHeight }) => mat4.perspective(
  [],
  Math.PI / 4,
  viewportWidth / viewportHeight,
  0.01,
  2000,
);

const minBias = () => 0.005;

const maxBias = () => 0.03;

type Props = {
  view: () => number[],
  fbo: any,
  shadowRes: number,
}

export default (({ view, fbo, shadowRes, ...props }: Props) => (
  <Drawable
    uniforms={{
      view,
      projection,
      shadowMap: fbo,
      minBias,
      maxBias,
      shadowRes,
    }}
    frag={frag}
    vert={vert}
    {...(props: $Rest<Props, any>)}
  />
): React.AbstractComponent<Props>);
