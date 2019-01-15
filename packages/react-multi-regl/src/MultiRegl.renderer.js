import { ReglRenderer, CONSTANTS } from '@psychobolt/react-regl';

import { Context, View } from './types';
import { CONSTANTS as NEW_CONSTANTS } from './MultiRegl.types';

export default class MultiReglRenderer extends ReglRenderer {
  getInstanceFactory() {
    return {
      ...this.defaultTypes,
      [CONSTANTS.Regl]: props => new Context(props),
      [NEW_CONSTANTS.View]: (props, context) => new View(props, context),
    };
  }
}
