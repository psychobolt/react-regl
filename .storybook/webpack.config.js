const path = require('path');

module.exports = (baseConfig, env, defaultConfig) => ({
  ...defaultConfig,
  resolve: {
    ...defaultConfig.resolve,
    alias: {
      '@psychobolt/react-regl': path.resolve(__dirname, '../dist'),
    },
  },
  module: {
    ...defaultConfig.module,
    rules: [
      // Temp fix for issue: https://github.com/storybooks/storybook/issues/3346
      ...defaultConfig.module.rules.filter(rule => !(
        (rule.use && rule.use.length && rule.use.find(({ loader }) => loader === 'babel-loader'))
      )),
      {
        test: /\.dds/,
        loader: require.resolve('file-loader'),
        query: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.jsx?$/,
        include: path.resolve('./'),
        exclude: /(node_modules|dist|cjs|umd)/,
        loader: 'babel-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'source-map-loader',
        enforce: 'pre',
      },
      {
        test: /\.(frag|vert)$/,
        loaders: ['webpack-glsl-loader'],
        include: path.resolve(__dirname, '../stories'),
      },
    ],
  },
});
