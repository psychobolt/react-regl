// @flow
import Context from './Context';
import Collection from './Collection';
import Drawable from './Drawable';

export default class Instance extends Drawable {
  constructor(props: any, context: Context) {
    super(props, context, false);
  }

  init() {
    if (this.instance) this.instance.destroy(); // eslint-disable-line
    return null;
  }

  setArgs(args: {}) {
    super.setArgs(args);
    this.instance = this.init();
  }

  getInstance() {
    return (this.instance && this.instance.get && this.instance.get()) || this.instance;
  }

  update(args?: {}, context?: any) {
    const argument = args || this.args;
    if (argument) {
      super.update(args, context);
    } else {
      Collection.prototype.update.call(this, args, context);
    }
  }

  destroy() {
    if (this.instance) this.instance.destroy();
    super.destroy();
  }
}
