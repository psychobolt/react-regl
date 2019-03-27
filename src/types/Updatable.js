// @flow
import typeof Collection from './Collection';
import typeof Context from './Context';

type Props = {
  onUpdate: () => any
}

type ReglContext = {};

export default (Subclass: Collection) => class extends Subclass {
  constructor({ onUpdate, ...props }: Props, context: Context) {
    super(props, context);
    this.overrideUpdate(onUpdate);
  }

  updateProps(newProps: Props) {
    const { onUpdate, ...props } = newProps;
    super.updateProps(props);
    if ('onUpdate' in newProps) this.overrideUpdate(onUpdate);
  }

  overrideUpdate(callback: any) {
    this.onUpdate = callback;
  }

  draw(args?: {}, context: ReglContext) {
    super.update(args, context);
  }

  update(context: ReglContext) {
    if (this.onUpdate) {
      const { regl } = this.context;
      this.onUpdate({ ...context, regl, draw: args => this.draw(args, context) });
    } else {
      this.draw(undefined, context);
    }
  }
};
