import Drawable from './Drawable';

export default class Instance extends Drawable {
  constructor(props, context) {
    super(props, context, false);
  }

  init() {
    this.instance?.destroy(); // eslint-disable-line
    return null;
  }

  setArgs(args) {
    super.setArgs(args);
    this.instance = this.init();
  }

  getInstance() {
    return this.instance?.get?.() || this.instance;
  }

  destroy() {
    this.instance?.destroy(); // eslint-disable-line
    super.destroy();
  }
}
