import _ from 'lodash';

import Collection from './Collection';
import Updatable from './Updatable';

export default class Drawable extends Updatable(Collection) {
  constructor({ args = {}, ...props }, context, scoped = true) {
    super(props, context);
    this.setArgs(args);
    this.instance = this.init();
    this.scoped = scoped;
  }

  init() {
    return this.context.regl(this.props);
  }

  updateProps(props) {
    super.updateProps(props);
    this.instance = this.init();
  }

  setArgs(args) {
    this.args = args;
  }

  getInstance() {
    return this.instance;
  }

  update(args, context) {
    let options = typeof this.args === 'function' ? this.args(context) : this.args;
    if (_.isArray(options) || _.isArray(args)) {
      options = [...options, ...args];
    } else if (_.isObject(options) || _.isObject(options)) {
      options = { ...options, ...args };
    }
    if (this.children.length) {
      if (this.scoped) {
        this.instance(options, () => super.update(context));
      } else {
        this.instance(options);
        super.update(context);
      }
    } else {
      this.instance(options);
    }
  }
}
