// @flow
import Instance from './Instance';

export default class Texture extends Instance {
  init(): any {
    super.init();
    const { regl } = this.context || {};
    const { source } = this.props;
    return source ? regl.texture(source) : regl.texture(this.props);
  }
}
