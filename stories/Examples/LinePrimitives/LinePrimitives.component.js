import * as React from 'react';
import mat4 from 'gl-mat4';

import { ReglContainer, Context, Frame, Drawable } from 'src';

import Square from './Square';
import Triangle from './Triangle';
import Hexagon from './Hexagon';
import StarShapedThingy from './StarShapedThingy';
import RockLikeShape from './RockLikeShape';
import Spiral from './Spiral';
import RoseCurve from './RoseCurve';
import SineCurve from './SineCurve';
import SineDecayCurve from './SineDecayCurve';
import frag from './LinePrimatives.frag';
import vert from './LinePrimatives.vert';

const uniforms = {
  tick: ({ tick }) => tick,
  projection: ({ viewportWidth, viewportHeight }) => mat4.perspective(
    [],
    Math.PI / 4,
    viewportWidth / viewportHeight,
    0.01,
    1000,
  ),
  view: mat4.lookAt([], [2.1, 0, 1.3], [0, 0.0, 0], [0, 0, 1]),
};

let lineWidth = 3;

const onMount = ({ regl }) => {
  // make sure to respect system limitations.
  if (lineWidth > regl.limits.lineWidthDims[1]) {
    lineWidth = regl.limits.lineWidthDims[1]; // eslint-disable-line prefer-destructuring
  }
};

const clear = ({ regl }) => regl.clear({
  color: [0, 0, 0, 1],
  depth: 1,
});

export default () => (
  <ReglContainer onMount={onMount}>
    <Frame onFrame={clear}>
      <Context.Consumer>
        {() => (
          <Drawable
            uniforms={uniforms}
            frag={frag}
            vert={vert}
          >
            <Square lineWidth={lineWidth} />
            <Triangle lineWidth={lineWidth} />
            <Hexagon lineWidth={lineWidth} />
            <StarShapedThingy lineWidth={lineWidth} />
            <RockLikeShape lineWidth={lineWidth} />
            <Spiral lineWidth={lineWidth} />
            <RoseCurve lineWidth={lineWidth} />
            <SineCurve lineWidth={lineWidth} />
            <SineDecayCurve lineWidth={lineWidth} />
          </Drawable>
        )}
      </Context.Consumer>
    </Frame>
  </ReglContainer>
);
