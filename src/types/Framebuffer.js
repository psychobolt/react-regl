import Instance from './Instance';

export default class Framebuffer extends Instance {
  constructor({ fitView, ...props }, context) {
    super(props, context);
    this.fitView = fitView;
  }

  init() {
    if (this.instance) return this.instance;
    return this.context.regl.framebuffer(this.props);
  }

  update(args, context) {
    const { viewportWidth, viewportHeight } = context;
    if (this.fitView) {
      this.instance.resize(viewportWidth, viewportHeight);
    }
    super.update(args, context);
  }
}
