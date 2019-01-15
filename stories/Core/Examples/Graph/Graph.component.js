import React from 'react';
import { ReglContainer, Frame, Context, Drawable } from '@psychobolt/react-regl';
import _ from 'lodash';

import { FIELD_RES, VERTEX_TEXTURE_SIZE, VERTEX_IDS, VERTEX_STATE_DATA } from './constants';

import SplatMouse from './SplatMouse';
import SplatVerts from './SplatVerts';
import BlurPass from './BlurPass';
import GradPass from './GradPass';
import SpringForces from './SpringForces';
import Verts from './Verts';
import Points from './Points';
import Edges from './Edges';

const contextProps = {
  extensions: ['webgl_draw_buffers', 'oes_texture_float'],
};

const BLUR_PASSES = 2;

let VERTEX_ID_BUFFER;
let VERTEX_STATE;
let FIELDS;
let lineWidth = 2;
const onMount = ({ regl }) => {
  VERTEX_ID_BUFFER = regl.buffer(VERTEX_IDS);
  VERTEX_STATE = [
    regl.framebuffer({
      color: regl.texture({
        radius: VERTEX_TEXTURE_SIZE,
        data: VERTEX_STATE_DATA,
        type: 'float',
      }),
      depthStencil: false,
    }),
    regl.framebuffer({
      radius: VERTEX_TEXTURE_SIZE,
      colorType: 'float',
      depthStencil: false,
    }),
  ];

  // Initialize fields
  FIELDS = [
    regl.framebuffer({
      color: regl.texture({
        type: 'float',
        wrap: 'repeat',
        radius: FIELD_RES,
      }),
      depthStencil: false,
    }),
    regl.framebuffer({
      color: regl.texture({
        type: 'float',
        wrap: 'repeat',
        radius: FIELD_RES,
      }),
      depthStencil: false,
    }),
  ];

  if (lineWidth > regl.limits.lineWidthDims[1]) {
    lineWidth = regl.limits.lineWidthDims[1]; // eslint-disable-line prefer-destructuring
  }
};

const splatVertsArgs = ({ tick }) => ({
  vertexState: VERTEX_STATE[(tick + 1) % 2],
});

const springForcesArgs = ({ tick }) => ({
  dest: VERTEX_STATE[(tick + 1) % 2],
  src: VERTEX_STATE[tick % 2],
});

const vertsArgs = ({ tick }) => ({
  dest: VERTEX_STATE[tick % 2],
  src: VERTEX_STATE[(tick + 1) % 2],
  field: FIELDS[1],
});

export default () => (
  <ReglContainer contextProps={contextProps} onMount={onMount}>
    <Context.Consumer>
      {
        ({ context }) => (
          <Frame>
            {/* Potential field computation */}
            <Drawable framebuffer={FIELDS[0]}>
              <Drawable render={() => context.regl.clear({
                color: [0, 0, 0, 1],
              })}
              />
              <SplatMouse />
              <SplatVerts
                id={VERTEX_ID_BUFFER}
                vertexState={context.regl.prop('vertexState')}
                args={splatVertsArgs}
              />
            </Drawable>
            {_.times(2 * BLUR_PASSES, i => (
              <BlurPass
                key={`blur-pass-${i}`}
                framebuffer={FIELDS[(i + 1) % 2]}
                src={FIELDS[(i % 2)]}
                axis={i % 2}
              />
            ))}
            <GradPass
              framebuffer={FIELDS[1]}
              src={FIELDS[0]}
            />
            <SpringForces
              framebuffer={context.regl.prop('dest')}
              vertexState={context.regl.prop('src')}
              args={springForcesArgs}
            />
            {/* Vertex Advection */}
            <Verts
              framebuffer={context.regl.prop('dest')}
              vertexState={context.regl.prop('src')}
              field={context.regl.prop('field')}
              tick={context.regl.context('tick')}
              args={vertsArgs}
            />
            <Drawable render={() => context.regl.clear({
              color: [1, 1, 1, 1],
            })}
            />
            <Edges vertexState={VERTEX_STATE} dir={context.regl.prop('dir')} lineWidth={lineWidth} />
            <Points id={VERTEX_ID_BUFFER} vertexState={VERTEX_STATE} />
          </Frame>
        )
      }
    </Context.Consumer>
  </ReglContainer>
);
