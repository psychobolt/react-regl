import Collection from './Collection';

export default class Frame extends Collection {
  children = [];

  constructor({ onFrame, update, ...props }, context) {
    super(props, context);
    this.callOnFrame(onFrame);
    this.overrideUpdate(update);
  }

  updateProps(newProps) {
    const { onFrame, update, ...props } = newProps;
    super.updateProps(props);
    if (onFrame in newProps) this.callOnFrame(onFrame);
    if (update in newProps) this.overrideUpdate(update);
  }

  callOnFrame(callback = () => {}) {
    this.onFrame = callback;
  }

  overrideUpdate(callback) {
    this.update = callback;
  }

  draw() {
    if (this.frame) return;
    const { regl } = this.context;
    const draw = context => {
      this.onFrame({ context, regl });
      super.draw(context);
    };
    this.frame = regl.frame(context => {
      if (this.update) {
        this.update({ context, regl, draw: () => draw(context) });
      } else {
        draw(context);
      }
    });
  }

  destroy() {
    super.destroy();
    if (this.frame) this.frame.cancel();
  }
}
