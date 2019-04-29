// @flow
import * as React from 'react';
import { Drawable } from '@psychobolt/react-regl';
import mat4 from 'gl-mat4';
import vec3 from 'gl-vec3';

const CUBEMAP_SIDES = [
  { eye: [0, 0, 0], target: [1, 0, 0], up: [0, -1, 0] },
  { eye: [0, 0, 0], target: [-1, 0, 0], up: [0, -1, 0] },
  { eye: [0, 0, 0], target: [0, 1, 0], up: [0, 0, 1] },
  { eye: [0, 0, 0], target: [0, -1, 0], up: [0, 0, -1] },
  { eye: [0, 0, 0], target: [0, 0, 1], up: [0, -1, 0] },
  { eye: [0, 0, 0], target: [0, 0, -1], up: [0, -1, 0] },
];

type Context = {};

type DrawProps = {};

type Props = {
  center: number[],
  fbo: any,
  children: React.Node,
};

export default class CubeMap extends React.Component<Props> {
  projection = new Float32Array(16);

  view = new Float32Array(16);

  constructor(props: Props) {
    super(props);
    mat4.perspective(
      this.projection,
      Math.PI / 2.0,
      1.0,
      0.25,
      1000.0,
    );
  }

  getView = (context: Context, props: DrawProps, batchId: number) => {
    const { center } = this.props;
    const { view } = this;
    const side = CUBEMAP_SIDES[batchId];
    const target = vec3.add([0, 0, 0], center, side.target);
    mat4.lookAt(view, center, target, side.up);
    return view;
  }

  framebuffer = (context: Context, props: DrawProps, batchId: number) => {
    const { fbo } = this.props;
    return fbo.faces[batchId];
  }

  render() {
    const { center, children } = this.props;
    const { projection, framebuffer, getView } = this;
    return (
      <Drawable
        framebuffer={framebuffer}
        context={{
          projection,
          view: getView,
          eye: center,
        }}
        args={6}
      >
        {children}
      </Drawable>
    );
  }
}
