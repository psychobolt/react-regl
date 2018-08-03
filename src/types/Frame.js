import Collection from './Collection';

export default class Frame extends Collection {
  children = [];

  constructor({ onFrame, ...props }, context) {
    super(props);
    this.context = context;
    this.callOnFrame(onFrame);
  }

  callOnFrame(callback = () => {}) {
    this.onFrame = callback;
  }

  draw() {
    if (this.frame) this.frame.cancel();
    const { regl } = this.context;
    this.frame = regl.frame(context => {
      this.onFrame({ context, regl });
      super.draw();
    });
  }

  destroy() {
    super.destroy();
    if (this.frame) this.frame.cancel();
  }
}
