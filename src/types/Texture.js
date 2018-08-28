import Drawable from './Drawable';

export default class Texture extends Drawable {
  constructor(props, context) {
    super(props, context, false);
  }

  init() {
    if (this.instance) this.instance.destroy();
    const { regl } = this.context;
    const { image } = this.props;
    const instance = image ? regl.texture(image) : regl.texture(this.props);
    let rendered = false;
    const result = options => {
      if (!rendered || this.args.copy) {
        instance(options);
        rendered = true;
      }
    };
    result.get = () => instance;
    result.destroy = () => instance.destroy();
    return result;
  }

  setArgs(args) {
    super.setArgs(args);
    this.instance = this.init();
  }

  getInstance() {
    return this.instance.get();
  }

  destroy() {
    this.instance.destroy();
    super.destroy();
  }
}
