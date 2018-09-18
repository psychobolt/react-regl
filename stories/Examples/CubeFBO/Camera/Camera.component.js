// @flow
import * as React from 'react';
import mat4 from 'gl-mat4';

import { Context, Drawable } from '@psychobolt/react-regl';

const fov = Math.PI / 4.0;
const up = [0, 1, 0];

type ReglContext = {
  viewportWidth: number, // eslint-disable-line react/no-unused-prop-types
  viewportHeight: number // eslint-disable-line react/no-unused-prop-types
}

type Args = {
  eye: number[] | (context: ReglContext) => number[],
  target: number[]
}

type Props = {
  args: Args,
  children: React.Node
};

export default class Camera extends React.Component<Props> {
  projection = new Float32Array(16);

  view = new Float32Array(16);

  getProjection = ({ viewportWidth, viewportHeight }: ReglContext) => mat4.perspective(
    this.projection,
    fov,
    viewportWidth / viewportHeight,
    0.01,
    1000.0,
  )

  getView = (context: ReglContext, { eye, target }: Args) => mat4.lookAt(
    this.view,
    eye,
    target,
    up,
  )

  render() {
    const { args, children } = this.props;
    return (
      <Context.Consumer>
        {({ context }) => (
          <Drawable
            context={{
              projection: this.getProjection,
              view: this.getView,
              eye: context.regl.prop('eye'),
            }}
            args={args}
          >
            {children}
          </Drawable>
        )}
      </Context.Consumer>
    );
  }
}
