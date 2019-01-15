import { Types } from '@psychobolt/react-regl';

export default class View extends Types.Collection {
  constructor(props, multiContext) {
    super(props, multiContext);
    this.regl = multiContext.context(props);
    this.view = this.regl.container;
  }

  addChild(child) {
    super.addChild(child);
    Object.assign(child, { context: this });
  }
}
