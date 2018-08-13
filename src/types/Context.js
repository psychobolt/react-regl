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
    this.view = Context.getView(props);
  }

  static getView(props) {
    const { [Object.values(VIEW_TYPE).find(type => type in props) || 'canvas']: view } = props;
    return view;
  }

  destroy() {
    super.destroy();
    this.regl.destroy();
  }
}
