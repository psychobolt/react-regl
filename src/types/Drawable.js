// @flow
import _ from 'lodash';

import Context from './Context';
import Collection from './Collection';
import Updatable from './Updatable';

let drawId = 0;

type Props = {
  name: string,
  args: {},
  render?: () => void,
  onUpdate?: {} => void,
}

export default class Drawable extends Updatable(Collection) {
  constructor({ name, args, ...props }: Props, context: Context, scoped: boolean = true) {
    super(props, context);
    drawId += 1;
    this.id = `drawable_${drawId}`;
    this.name = name;
    this.args = args;
    this.instance = this.init();
    this.scoped = scoped;
  }

  id: string

  name: string

  args: {}

  instance: any

  scoped: boolean

  init() {
    const { render, ...props } = this.props;
    return render || (this.context && this.context.regl(props));
  }

  updateProps(props: Props) {
    super.updateProps(props);
    this.instance = this.init();
  }

  setArgs(args: {}) {
    this.args = args;
  }

  getInstance() {
    return this.instance;
  }

  update(args?: {}, context?: {}) {
    let options = typeof this.args === 'function' ? this.args(context) : this.args;
    if (_.isUndefined(options)) {
      options = args;
    } else if (_.isArray(options)) {
      if (_.isArray(args)) {
        // $FlowFixMe
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
