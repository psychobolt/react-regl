const path = require('path');

module.exports = {
  module: {
    rules: [{
      test: /\.(frag|vert)$/,
      loaders: ['webpack-glsl-loader'],
      include: path.resolve(__dirname, '../stories'),
    }],
  },
};
