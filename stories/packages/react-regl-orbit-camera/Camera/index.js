import README from './README.md';

export default {
  title: 'packages/react-regl-orbit-camera',
};

module.exports.Camera = require('./Camera.component').default;

module.exports.Camera.parameters = {
  layout: 'fullscreen',
  docs: {
    page: README,
    source: {
      code: require('!!raw-loader!./Camera.component').default, // eslint-disable-line global-require
    },
  },
};
