const path = require('path');

module.exports = (baseConfig, env, defaultConfig) => ({
  ...defaultConfig,
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.(frag|vert)$/,
        loaders: ['webpack-glsl-loader'],
        include: path.resolve(__dirname, '../stories'),
      },
    ],
  },
});
