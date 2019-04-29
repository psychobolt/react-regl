// @flow
import regl from 'regl';

import Collection from './Collection';

export const VIEW_TYPE = {
  Canvas: 'canvas',
  GL: 'gl',
  Container: 'container',
};

type Props = {};

export default class Context extends Collection<Props> {
  constructor(props: Props) {
    super(props);
    this.context = this;
    this.regl = regl(props);
    const { _gl: gl } = this.regl;
    this.view = gl.canvas;
  }

  regl: any

  view: HTMLCanvasElement

  destroy() {
    super.destroy();
    this.regl.destroy();
  }
}
