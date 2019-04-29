import * as React from 'react';
import { ReglContainer, Context, Frame, Drawable } from '@psychobolt/react-regl';

import Quad from './Quad';
import frag from './Life.frag';

const RADIUS = 512;
const INITIAL_CONDITIONS = (Array(RADIUS * RADIUS * 4)).fill(0)
  .map(() => (Math.random() > 0.9 ? 255 : 0));

let state;
let framebuffer;
let quadUniforms;

const onMount = ({ regl }) => {
  state = (Array(2)).fill().map(() => regl.framebuffer({
    color: regl.texture({
      radius: RADIUS,
      data: INITIAL_CONDITIONS,
      wrap: 'repeat',
    }),
    depthStencil: false,
  }));

  framebuffer = ({ tick }) => state[(tick + 1) % 2];

  quadUniforms = {
    prevState: ({ tick }) => state[tick % 2],
  };
};

const uniforms = {
  radius: RADIUS,
};

export default () => (
  <ReglContainer onMount={onMount}>
    <Frame>
      <Context.Consumer>
        {() => (
          <Quad
            onUpdate={({ regl, draw }) => {
              regl.draw();
              draw();
            }}
            uniforms={quadUniforms}
          >
            <Drawable
              frag={frag}
              framebuffer={framebuffer}
              uniforms={uniforms}
            />
          </Quad>
        )}
      </Context.Consumer>
    </Frame>
  </ReglContainer>
);
