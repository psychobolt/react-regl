import Instance from './Instance';

export default class Texture extends Instance {
  init() {
    super.init();
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
}
