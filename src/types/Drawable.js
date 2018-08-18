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

  update(context) {
    const args = typeof this.args === 'function' ? this.args(context) : this.args;
    if (this.children.length) {
      this.command(args, () => super.update(context));
    } else {
      this.command(args);
    }
  }
}
