import regl from 'regl';

import Collection from './Collection';

export const VIEW_TYPE = {
  Canvas: 'canvas',
  GL: 'gl',
  Container: 'container',
};

export default class Context extends Collection {
  constructor(props) {
    super(props);
    this.context = this;
    this.regl = regl(props);
    const { _gl: gl } = this.regl;
    this.view = gl.canvas;
  }

  destroy() {
    super.destroy();
    this.regl.destroy();
  }
}
