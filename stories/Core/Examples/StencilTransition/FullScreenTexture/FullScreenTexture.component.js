// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';

import frag from './FullScreenTexture.frag';
import vert from './FullScreenTexture.vert';

const { Drawable } = ReactRegl;

const attributes = {
  position: [
    [-1, -1], [1, -1], [1, 1],
    [-1, -1], [1, 1], [-1, 1],
  ],
};

const viewportWidth = context => context.viewportWidth;
const viewportHeight = context => context.viewportHeight;

const depth = {
  enable: false,
};

// Takes this many frames to transition from one scene to the other.
export const CYCLE_LENGTH = 60;

const args = ({ tick }) => {
  const normTick = tick % CYCLE_LENGTH; // normalize tick to be in range [0, CYCLE_LENGTH - 1]
  let t = normTick * normTick * 0.001;
  if (t > 1.0) {
    t = 1.0;
  }
  return { t };
};

type Props = {
  textures: any[],
  count: number,
  width: number,
  height: number,
};

export default ({ textures, count, width, height, ...props }: Props) => (
  <Drawable
    frag={frag}
    vert={vert}
    attributes={attributes}
    uniforms={{
      viewportWidth,
      viewportHeight,
      // cycle throught the transtion textures, as t goes from 0.0 to 1.0
      tex: (_, { t }) => textures[Math.floor(t * count)],
      scale: context => [
        Math.ceil(context.viewportWidth / width),
        Math.ceil(context.viewportHeight / height),
      ],
    }}
    count={6}
    depth={depth}
    args={args}
    {...props}
  />
);
