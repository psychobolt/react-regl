import React from 'react';

import { ReglContainer, Context, Frame, Drawable } from 'src';

import frag from './Mipmap.frag';
import vert from './Mipmap.vert';

const attributes = {
  position: [
    -2, 0,
    0, -2,
    2, 2,
  ],
};

const getTick = ({ tick }) => 0.005 * tick;

const data = [
  [255, 255, 255, 255, 0, 0, 0, 0],
  [255, 255, 255, 255, 0, 0, 0, 0],
  [255, 255, 255, 255, 0, 0, 0, 0],
  [255, 255, 255, 255, 0, 0, 0, 0],
  [0, 0, 0, 0, 255, 255, 255, 255],
  [0, 0, 0, 0, 255, 255, 255, 255],
  [0, 0, 0, 0, 255, 255, 255, 255],
  [0, 0, 0, 0, 255, 255, 255, 255],
];

export default () => (
  <ReglContainer>
    <Frame>
      <Context.Consumer>
        {({ context }) => (
          <Drawable
            frag={frag}
            vert={vert}
            attributes={attributes}
            uniforms={{
              tick: getTick,
              texture: context.regl.texture({
                min: 'linear mipmap linear',
                mag: 'nearest',
                wrap: 'repeat',
                data,
              }),
            }}
            count={3}
          />
        )}
      </Context.Consumer>
    </Frame>
  </ReglContainer>
);
