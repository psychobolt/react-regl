// @flow
import type Context from './Context';

type Props = {
  onUpdate?: {} => void
}

interface Updatable {
  onUpdate: void | any => void;
  updateProps(newProps: any): void;
  overrideUpdate(callback: any): void;
  draw(args?: {}, context?: {}): void;
  update(context?: {}): void;
}

export default (Subclass => class extends Subclass implements Updatable {
  constructor({ onUpdate, ...props }: Props, context: Context<Props>) {
    super(props, context);
    this.overrideUpdate(onUpdate);
  }

  updateProps(newProps) {
    const { onUpdate, ...props } = newProps;
    super.updateProps(props);
    if ('onUpdate' in newProps) this.overrideUpdate(onUpdate);
  }

  overrideUpdate(callback) {
    this.onUpdate = callback;
  }

  draw(args, context) {
    super.update(args, context);
  }

  update(context) {
    if (this.onUpdate) {
      const { regl } = this.context || {};
      this.onUpdate({ ...context, regl, draw: args => this.draw(args, context) });
    } else {
      this.draw(undefined, context);
    }
  }
}: (Subclass: Class<*>) => Class<*>);
