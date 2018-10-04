import _ from 'lodash';

import Collection from './Collection';
import Updatable from './Updatable';

export default class Drawable extends Updatable(Collection) {
  constructor({ args, ...props }, context, scoped = true) {
    super(props, context);
    this.args = args;
    this.instance = this.init();
    this.scoped = scoped;
  }

  init() {
    const { render, ...props } = this.props;
    return render || this.context.regl(props);
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
    if (_.isUndefined(options)) {
      options = args;
    } else if (_.isArray(options)) {
      if (_.isArray(args)) {
        options = [...options, ...args];
      }
    } else if (_.isObject(options) && _.isObject(args)) {
      options = { ...options, ...args };
    }
    if (this.children.length) {
      if (this.scoped) {
        this.instance(options, () => super.update(context));
      } else {
        super.update(context);
        this.instance(options);
      }
    } else {
      this.instance(options);
    }
  }
}
