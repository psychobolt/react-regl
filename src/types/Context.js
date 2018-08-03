import regl from 'regl';

import Collection from './Collection';

export default class Context extends Collection {
  constructor(props) {
    super();
    this.regl = regl(props);
  }

  destroy() {
    super.destroy();
    this.regl.destroy();
  }
}
