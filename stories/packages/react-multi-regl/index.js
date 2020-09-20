import { MultiReglContainer } from '@psychobolt/react-multi-regl';

export default {
  title: 'packages/react-multi-regl',
  component: MultiReglContainer,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Simple = require('./Simple').default; // eslint-disable-line global-require

Simple.parameters = {
  docs: {
    source: {
      code: require('!!raw-loader!./Simple/Simple.component').default, // eslint-disable-line global-require
    },
  },
};

export const SPHGallery = require('./SPHGallery').default; // eslint-disable-line global-require

SPHGallery.parameters = {
  docs: {
    source: {
      code: require('!!raw-loader!./SPHGallery/SPHGallery.component').default, // eslint-disable-line global-require
    },
  },
};
