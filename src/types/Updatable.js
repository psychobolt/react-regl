// @flow
import Collection from './Collection';
import type Context from './Context';

type Props = {
  onUpdate?: {} => void
}

export default (Subclass: typeof Collection) => class extends Subclass<any> {
  constructor({ onUpdate, ...props }: Props, context: Context) {
    super(props, context);
    this.overrideUpdate(onUpdate);
  }

  onUpdate: any => void

  updateProps(newProps: any) {
    const { onUpdate, ...props } = newProps;
    super.updateProps(props);
    if ('onUpdate' in newProps) this.overrideUpdate(onUpdate);
  }

  overrideUpdate(callback: any) {
    this.onUpdate = callback;
  }

  draw(args?: {}, context?: {}) {
    super.update(args, context);
  }

  update(context?: {}) {
    if (this.onUpdate) {
      const { regl } = this.context || {};
      this.onUpdate({ ...context, regl, draw: args => this.draw(args, context) });
    } else {
      this.draw(undefined, context);
    }
  }
};
