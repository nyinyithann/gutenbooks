const path = require('path');
const Dotenv = require('dotenv-webpack');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development',
  plugins: [
    new ReactRefreshPlugin(),
    new Dotenv({
      path: path.resolve(__dirname, '..', './.env.development'),
    }),
  ].filter(Boolean),
  devServer: {
    historyApiFallback: true,
    hot: true,
    liveReload: true,
    open: true,
    host: '0.0.0.0',
    port: 8080,
    client: { overlay: false },
    proxy: {
      '/dev': {
        target: {
          host: '54.255.67.106',
          protocol: 'http:',
          port: 80,
        },
        pathRewrite: {
          '^/dev': '',
        },
      },
    },
  },
  devtool: 'source-map',
};
