import * as Types from './types';

export const CONSTANTS = {
  Regl: 'Regl',
  Drawable: 'Drawable',
  Frame: 'Frame',
  Texture: 'Texture',
};

export default {
  [CONSTANTS.Regl]: props => new Types.Context(props),
  [CONSTANTS.Drawable]: (props, context) => new Types.Drawable(props, context),
  [CONSTANTS.Frame]: (props, context) => new Types.Frame(props, context),
  [CONSTANTS.Texture]: (props, context) => new Types.Texture(props, context),
};

export const {
  Regl,
  Drawable,
  Frame,
} = CONSTANTS;
