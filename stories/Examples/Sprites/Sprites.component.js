import React from 'react';
import { ReglContainer, Context, Frame, Drawable } from '@psychobolt/react-regl';
import styled from 'styled-components';
import mouseChange from 'mouse-change';

import Update from './Update';
import vert from './Sprites.vert';
import frag from './Sprites.frag';
import * as styles from './Sprites.style';

const contextProps = {
  extensions: 'OES_texture_float',
};

const mouse = mouseChange();

const N = 512;
const BLOCK_SIZE = 64;

let SPRITES;

function onMount({ regl }) {
  SPRITES = Array(2).fill().map(() => regl.framebuffer({
    radius: N,
    colorType: 'float',
    depthStencil: false,
  }));
}

const framebuffer = ({ tick }) => SPRITES[(tick + 1) % 2];

const attributes = {
  sprite: Array(N * N).fill().map((_, i) => {
    const x = i % N;
    const y = (i / N) | 0;
    return [(x / N), (y / N)];
  }).reverse(),
};

const state = ({ tick }) => SPRITES[tick % 2];

const uniforms = {
  state,
};

const Count = styled.div`${styles.count}`;

const toScreen = (x, size, pixelRatio) => Math
  .min(Math.max(2.0 * pixelRatio * x / size - 1.0, -0.999), 0.999);

export default class Sprites extends React.Component {
  state = {
    count: 0,
  }

  BLOCK = {
    data: new Float32Array(4 * BLOCK_SIZE),
    width: BLOCK_SIZE,
    height: 1,
  };

  onFrame = ({ tick, drawingBufferWidth, drawingBufferHeight, pixelRatio }) => {
    const mouseX = toScreen(mouse.x, drawingBufferWidth, pixelRatio);
    const mouseY = -toScreen(mouse.y, drawingBufferHeight, pixelRatio);

    const { BLOCK } = this;
    const { count } = this.state;
    if (mouse.buttons) {
      for (let i = 0; i < BLOCK_SIZE; i += 1) {
        BLOCK.data[4 * i] = mouseX;
        BLOCK.data[4 * i + 1] = mouseY;
        BLOCK.data[4 * i + 2] = 0.25 * (Math.random() - 0.5);
        BLOCK.data[4 * i + 3] = Math.random();
      }
      SPRITES[tick % 2].color[0].subimage(BLOCK, count % N, ((count / N) | 0) % N);
      this.setState(prevState => ({ count: prevState.count + BLOCK_SIZE }));
    }
  }

  render() {
    const { count } = this.state;
    return (
      <>
        <Count>{count}</Count>
        <ReglContainer contextProps={contextProps} onMount={onMount}>
          <Context.Consumer>
            {({ context }) => (
              <Frame onFrame={this.onFrame}>
                <Update framebuffer={framebuffer} state={state} />
                <Drawable
                  render={() => context.regl.clear({
                    color: [0, 0, 0, 1],
                    depth: 1,
                  })}
                />
                <Drawable
                  vert={vert}
                  frag={frag}
                  attributes={attributes}
                  uniforms={uniforms}
                  primitive="points"
                  offset={N * N - count}
                  elements={null}
                  count={count}
                />
              </Frame>
            )}
          </Context.Consumer>
        </ReglContainer>
      </>
    );
  }
}
