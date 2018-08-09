import Drawable from './Drawable';

export default class Texture extends Drawable {
  constructor(props, context) {
    super(props, context);
    const { regl } = context;
    this.instance = regl.texture();
  }

  updateProps(props) {
    super.updateProps(props);
    this.initialized = false;
  }

  setArgs(args) {
    super.setArgs(args);
    this.initialized = false;
  }

  draw() {
    if (!this.initialized || this.args.copy) {
      this.instance(this.args);
      this.initialized = true;
    }
  }

  destroy() {
    this.instance.destroy();
  }
}
