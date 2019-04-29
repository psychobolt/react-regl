import React from 'react';
import { ReglContainer, Texture, Drawable } from '@psychobolt/react-regl';
import baboon from 'baboon-image';

import frag from './Texture.frag';
import vert from './Texture.vert';

const attributes = {
  position: [
    -2, 0,
    0, -2,
    2, 2,
  ],
};

export default () => (
  <ReglContainer>
    <Texture source={baboon}>
      {texture => (
        <Drawable
          frag={frag}
          vert={vert}
          attributes={attributes}
          uniforms={{
            texture,
          }}
          count={3}
        />
      )}
    </Texture>
  </ReglContainer>
);
