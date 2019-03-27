import * as Types from './types';

export const CONSTANTS = {
  Regl: 'Regl',
  Drawable: 'Drawable',
  Frame: 'Frame',
  Texture: 'Texture',
  Collection: 'Collection',
  Cube: 'Cube',
  Framebuffer: 'Framebuffer',
};

export default {
  [CONSTANTS.Regl]: props => new Types.Context(props),
  [CONSTANTS.Drawable]: (props, context) => new Types.Drawable(props, context),
  [CONSTANTS.Frame]: (props, context) => new Types.Frame(props, context),
  [CONSTANTS.Texture]: (props, context) => new Types.Texture(props, context),
  [CONSTANTS.Collection]: (props, context) => new Types.Collection(props, context),
  [CONSTANTS.Cube]: (props, context) => new Types.Cube(props, context),
  [CONSTANTS.Framebuffer]: (props, context) => new Types.Framebuffer(props, context),
};

export const {
  Drawable,
  Frame,
  Collection,
} = CONSTANTS;
