// @flow
import Context from './Context';
import Collection from './Collection';
import Updatable from './Updatable';

type Callback = {} => void

type Props = {
  onFrame: Callback,
  onUpdate?: Callback
}

const Base: Class<*> = Updatable(Collection);

export default class Frame extends Base {
  constructor({ onFrame, ...props }: Props, context: Context) {
    super(props, context);
    this.callOnFrame(onFrame);
  }

  frame: any

  onFrame: Callback

  updateProps(newProps: Props) {
    const { onFrame, ...props } = newProps;
    super.updateProps(props);
    if ('onFrame' in newProps) this.callOnFrame(onFrame);
  }

  callOnFrame(callback: Callback = () => {}) {
    this.onFrame = callback;
  }

  draw(args?: {}, context?: {}) {
    const { regl } = this.context || {};
    this.onFrame({ ...context, regl });
    super.draw(args, context);
  }

  update() {
    if (this.frame) return;
    const { regl } = this.context || {};
    this.frame = regl.frame(context => super.update(context));
  }

  destroy() {
    super.destroy();
    if (this.frame) this.frame.cancel();
  }
}
