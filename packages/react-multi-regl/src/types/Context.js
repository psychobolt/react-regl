import { Types } from '@psychobolt/react-regl'; // eslint-disable-line import/named
import multiRegl from 'multi-regl';

export default class Context extends Types.Collection {
  static View = 'View';

  constructor(props) {
    super(props, multiRegl(props));
    this.regl = this.context.regl;
    const { _gl: gl } = this.regl;
    this.view = gl.canvas;
  }

  destroy() {
    super.destroy();
    this.regl.destroy();
    this.view.remove();
  }
}
