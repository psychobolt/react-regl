import _ from 'lodash';

import Collection from './Collection';
import Updatable from './Updatable';

export default class Drawable extends Updatable(Collection) {
  constructor({ args = {}, ...props }, context) {
    super(props, context);
    this.setArgs(args);
    this.init();
  }

  init() {
    this.command = this.context.regl(this.props);
  }

  updateProps(props) {
    super.updateProps(props);
    this.init();
  }

  setArgs(args) {
    this.args = args;
  }

  update(args, context) {
    let options = typeof this.args === 'function' ? this.args(context) : this.args;
    if (_.isArray(options) || _.isArray(args)) {
      options = [...options, ...args];
    } else if (_.isObject(options) || _.isObject(options)) {
      options = { ...options, ...args };
    }
    if (this.children.length) {
      this.command(options, () => super.update(context));
    } else {
      this.command(options);
    }
  }
}
