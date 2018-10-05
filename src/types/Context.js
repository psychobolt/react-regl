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
    this.regl = regl(props);
    const { _gl } = this.regl;
    this.view = Context.getView(_gl, props);
  }

  static getView(gl, props) {
    const { [Object.values(VIEW_TYPE).find(type => type in props) || 'canvas']: view } = props;
    return view || gl.canvas;
  }

  destroy() {
    super.destroy();
    this.regl.destroy();
  }
}
