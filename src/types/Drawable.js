import Collection from './Collection';

export default class Drawable extends Collection {
  draw(context) {
    if (this.children.length) {
      this.context.regl(this.props)(this.args, () => super.draw(context));
    } else {
      this.context.regl(this.props)(typeof this.args === 'function' ? this.args(context) : this.args);
    }
  }
}
