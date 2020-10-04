// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

import vert from './Silhoutte.vert';
import DATA from '../Models/Rabbit/shadow_bunny.json';

const { Drawable } = ReactRegl;

const model = (_, props) => props.model;

type Props = {
  buffer: any,
};

export default (({ buffer, ...props }: Props) => (
  <Drawable
    vert={vert}
    attributes={{
      position: {
        buffer,
        offset: 0,
        normalized: false,
        stride: 40,
        size: 4,
      },
      normal0: {
        buffer,
        offset: 16,
        normalized: false,
        stride: 40,
        size: 3,
      },
      normal1: {
        buffer,
        offset: 28,
        normalized: false,
        stride: 40,
        size: 3,
      },
    }}
    count={DATA.SHADOW.length / 10}
    uniforms={{
      model,
    }}
    {...(props: $Rest<Props, any>)}
  />
): React.AbstractComponent<Props>);
