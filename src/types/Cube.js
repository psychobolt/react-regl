import Collection from './Collection';
import Instance from './Instance';

export default class Cube extends Instance {
  init() {
    super.init();
    const { regl } = this.context;
    const { images } = this.props;
    return images ? regl.cube(...images) : regl.cube(this.props);
  }

  update(args, context) {
    if (this.args || args) {
      super.update(args, context);
    } else {
      Collection.prototype.update.call(this, args, context);
    }
  }
}
