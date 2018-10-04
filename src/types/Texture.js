import Drawable from './Drawable';

export default class Texture extends Drawable {
  constructor(props, context) {
    super(props, context, false);
  }

  init() {
    if (this.instance) this.instance.destroy();
    const { regl } = this.context;
    const { source } = this.props;
    const instance = source ? regl.texture(source) : regl.texture(this.props);
    const result = options => {
      if (this.args?.copy) {
        instance(options);
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
