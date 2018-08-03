import Collection from './Collection';

export default class Drawable extends Collection {
  constructor({ args, ...props }, context) {
    super();
    this.args = args;
    this.context = context;
    this.props = props;
  }

  updateProps(props) {
    this.props = {
      ...this.props,
      ...props,
    };
  }

  setArgs(args) {
    this.args = args;
  }

  draw() {
    if (this.children.length) {
      this.context.regl(this.props)(this.args, () => super.draw());
    } else {
      this.context.regl(this.props)(this.args);
    }
  }
}
