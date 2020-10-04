// @flow
import Context from './Context';
import Instance from './Instance';

type FrameContext = {
  viewportWidth: number,
  viewportHeight: number,
}

type Props = {
  fitView: boolean
}

export default class Framebuffer extends Instance {
  constructor({ fitView, ...props }: Props, context: Context) {
    super(props, context);
    this.fitView = fitView;
  }

  fitView: boolean

  init(): any {
    if (this.instance) return this.instance;
    return this.context ? this.context.regl.framebuffer(this.props) : null;
  }

  update(args?: {}, context?: FrameContext) {
    const { viewportWidth, viewportHeight } = context || {};
    if (this.fitView) {
      this.instance.resize(viewportWidth, viewportHeight);
    }
    super.update(args, context);
  }
}
