import React from 'react';

import { ReglContainer, Frame, Drawable, Texture } from '@psychobolt/react-regl';

import frag from './Feedback.frag';
import vert from './Feedback.vert';

const mousePosition = require('mouse-change')();

const clear = ({ regl }) => regl.clear({
  color: [0, 0, 0, 1],
});

const attributes = {
  position: [
    -2, 0,
    0, -2,
    2, 2,
  ],
};

const mouse = ({ pixelRatio, viewportHeight }) => [
  mousePosition.x * pixelRatio,
  viewportHeight - mousePosition.y * pixelRatio,
];

const t = ({ tick }) => 0.01 * tick;

const textureArgs = {
  copy: true,
};

export default () => (
  <ReglContainer>
    <Frame onFrame={clear}>
      <Texture args={textureArgs}>
        {texture => (
          <Drawable
            frag={frag}
            vert={vert}
            attributes={attributes}
            uniforms={{
              texture,
              mouse,
              t,
            }}
            count={3}
          />
        )}
      </Texture>
    </Frame>
  </ReglContainer>
);
