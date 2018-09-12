import Collection from './Collection';
import Updatable from './Updatable';

export default class Frame extends Updatable(Collection) {
  children = [];

  constructor({ onFrame, ...props }, context) {
    super(props, context);
    this.callOnFrame(onFrame);
  }

  updateProps(newProps) {
    const { onFrame, ...props } = newProps;
    super.updateProps(props);
    if (onFrame in newProps) this.callOnFrame(onFrame);
  }

  callOnFrame(callback = () => {}) {
    this.onFrame = callback;
  }

  draw(args, context) {
    const { regl } = this.context;
    this.onFrame({ ...context, regl });
    super.draw(args, context);
  }

  update() {
    if (this.frame) return;
    const { regl } = this.context;
    this.frame = regl.frame(context => super.update(context));
  }

  destroy() {
    super.destroy();
    if (this.frame) this.frame.cancel();
  }
}
