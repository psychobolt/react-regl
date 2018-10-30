import Instance from './Instance';

export default class Cube extends Instance {
  init() {
    super.init();
    const { regl } = this.context;
    const { images } = this.props;
    return images ? regl.cube(...images) : regl.cube(this.props);
  }

  update(args, context) {
    this.children.forEach(child => child.update(args, context));
  }
}
