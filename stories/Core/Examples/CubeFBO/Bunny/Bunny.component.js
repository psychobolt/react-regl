// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';
import mat4 from 'gl-mat4';
import normals from 'angle-normals';
import bunny from 'bunny';

import frag from './Bunny.frag';
import vert from '../CubeFBO.vert';

const { Context, Drawable } = ReactRegl;

const attributes = {
  position: bunny.positions,
  normal: normals(bunny.cells, bunny.positions),
};

const tint = [1.0, 0.8, 0.9];

const model = (context, { position }) => mat4.translate([], mat4.identity([]), position);

type ReglContext = {
  tick: number
};

type Props = {
  fbo: any,
  args: (context: ReglContext) => {
    position: number[]
  }
}

export default (({ fbo, args }: Props) => (
  <Context.Consumer>
    {({ context }) => (
      <Drawable
        frag={frag}
        vert={vert}
        elements={bunny.cells}
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
): React.AbstractComponent<Props>);
