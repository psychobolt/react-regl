// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';
import mat4 from 'gl-mat4';

const { Context, Drawable } = ReactRegl;

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
  projection: Float32Array = new Float32Array(16);

  view: Float32Array = new Float32Array(16);

  getProjection: (context: ReglContext) => any = ({ viewportWidth, viewportHeight }) => mat4
    .perspective(
      this.projection,
      fov,
      viewportWidth / viewportHeight,
      0.01,
      1000.0,
    )

  getView: (_: any, args: Args) => any = (_, { eye, target }) => mat4.lookAt(
    this.view,
    eye,
    target,
    up,
  )

  render(): React.Node {
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
