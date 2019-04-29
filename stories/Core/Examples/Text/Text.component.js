import React from 'react';
import { ReglContainer, Frame, Texture, Drawable } from '@psychobolt/react-regl';
import vectorizeText from 'vectorize-text';
import perspective from 'gl-mat4/perspective';
import lookAt from 'gl-mat4/lookAt';

import Feedback from './Feedback';
import frag from './Text.frag';
import vert from './Text.vert';

const textMesh = vectorizeText('hello regl!', {
  textAlgin: 'center',
  textBaseline: 'middle',
});

const attributes = {
  position: textMesh.positions,
};

const uniforms = {
  t: ({ tick }) => 0.01 * tick,
  view: ({ tick }) => {
    const t = 0.01 * tick;
    return lookAt(
      [],
      [5 * Math.sign(t), 0, -5 * Math.cos(t)],
      [0, 0, 0],
      [0, -1, 0],
    );
  },
  projection: ({ viewportWidth, viewportHeight }) => perspective(
    [],
    Math.PI / 4,
    viewportWidth / viewportHeight,
    0.01,
    1000,
  ),
};

const depth = {
  enable: false,
};

export default () => (
  <ReglContainer>
    <Texture
      copy
      min="linear"
      mag="linear"
    >
      {texture => (
        <Frame
          onUpdate={({ draw }) => {
            draw();
            texture({
              copy: true,
              min: 'linear',
              mag: 'linear',
            });
          }}
        >
          <Feedback texture={texture} />
          <Drawable
            frag={frag}
            vert={vert}
            attributes={attributes}
            elements={textMesh.edges}
            uniforms={uniforms}
            depth={depth}
          />
        </Frame>
      )}
    </Texture>
  </ReglContainer>
);
