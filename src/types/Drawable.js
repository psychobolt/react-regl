// @flow
import _ from 'lodash';

import Collection, { type Context } from './Collection';
import Updatable from './Updatable';

let drawId = 0;

export type CollectionProps = {
  render?: () => void,
  onUpdate?: {} => void,
}

type Props = {
  name: string,
  args: {},
} & CollectionProps;

const Base: Class<*> = Updatable(Collection);

export default class Drawable extends Base {
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

  init(): any {
    const { render, ...props } = this.props;
    return render || (this.context && this.context.regl(props));
  }

  updateProps(props: CollectionProps) {
    super.updateProps(props);
    this.instance = this.init();
  }

  setArgs(args: {}) {
    this.args = args;
  }

  getInstance(): any {
    return this.instance;
  }

  update(args?: {}, context?: {}) {
    let options = typeof this.args === 'function' ? this.args(context) : this.args;
    if (_.isUndefined(options)) {
      options = args;
    } else if (_.isArray(options)) {
      if (_.isArray(args)) {
        options = Array.prototype.concat.apply(options, args);
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
