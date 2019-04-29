// @flow
import * as React from 'react';
import { Context, Drawable } from '@psychobolt/react-regl';
import mat4 from 'gl-mat4';
import normals from 'angle-normals';
import conway from 'conway-hart';

import frag from './Teapot.frag';
import vert from '../CubeFBO.vert';

const teapot = conway('I');

const attributes = {
  position: teapot.positions.map(p => [
    2.2 * p[0],
    2.2 * p[1],
    2.2 * p[2],
  ]),
  normal: normals(teapot.cells, teapot.positions),
};

const tint = [0.9, 1.0, 0.8];

const model = (context, { position }) => mat4.translate([], mat4.identity([]), position);

type Props = {
  fbo: any,
  args: {
    position: number[]
  },
}

export default ({ fbo, args }: Props) => (
  <Context.Consumer>
    {({ context }) => (
      <Drawable
        frag={frag}
        vert={vert}
        elements={teapot.cells}
        attributes={attributes}
        uniforms={{
          view: context.regl.context('view'),
          projection: context.regl.context('projection'),
          eye: context.regl.context('eye'),
          tint,
          envMap: fbo,
          model,
        }}
        args={args}
      />
    )}
  </Context.Consumer>
);
