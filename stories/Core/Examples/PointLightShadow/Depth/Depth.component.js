// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';
import mat4 from 'gl-mat4';

import frag from './Depth.frag';
import vert from './Depth.vert';

const { Drawable } = ReactRegl;

const projection = mat4.perspective([], Math.PI / 2.0, 1.0, 0.25, 70.0);

type Props = {
  lightPos: number[],
  shadowFbo: any,
  children: React.Node,
};

export default ({ lightPos, shadowFbo, children }: Props) => (
  <Drawable
    uniforms={{
      projection,
      view(context, props, batchId) {
        switch (batchId) {
          case 0: // +x
            return mat4.lookAt(
              [],
              lightPos,
              [lightPos[0] + 1.0, lightPos[1], lightPos[2]],
              [0.0, -1.0, 0.0],
            );
          case 1: // -x
            return mat4.lookAt(
              [], lightPos,
              [lightPos[0] - 1.0, lightPos[1], lightPos[2]],
              [0.0, -1.0, 0.0],
            );
          case 2: // +y
            return mat4.lookAt(
              [],
              lightPos,
              [lightPos[0], lightPos[1] + 1.0, lightPos[2]],
              [0.0, 0.0, 1.0],
            );
          case 3: // -y
            return mat4.lookAt(
              [],
              lightPos,
              [lightPos[0], lightPos[1] - 1.0, lightPos[2]],
              [0.0, 0.0, -1.0],
            );
          case 4: // +z
            return mat4.lookAt(
              [],
              lightPos,
              [lightPos[0], lightPos[1], lightPos[2] + 1.0],
              [0.0, -1.0, 0.0],
            );
          case 5: // -z
            return mat4.lookAt(
              [],
              lightPos,
              [lightPos[0], lightPos[1], lightPos[2] - 1.0],
              [0.0, -1.0, 0.0],
            );
          default:
            return mat4.identity([]);
        }
      },
    }}
    frag={frag}
    vert={vert}
    framebuffer={(context, props, batchId) => shadowFbo.faces[batchId]}
    args={6}
  >
    {children}
  </Drawable>
);
