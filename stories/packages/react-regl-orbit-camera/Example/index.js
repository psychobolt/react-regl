import README from './README.md';

export default {
  title: 'packages/react-regl-orbit-camera',
};

module.exports.Example = require('./Example.component').default;

module.exports.Example.parameters = {
  layout: 'fullscreen',
  docs: {
    page: README,
  },
};
