const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ElectronReloadPlugin = require('webpack-electron-reload')({
  path: path.join(__dirname, '../build/main.bundle.js'),
});
const { merge } = require('webpack-merge');
const WebpackShellPlugin = require('webpack-shell-plugin-next');

const common = require('./webpack.common.js');

module.exports = 
[
  merge(common.electron, {
    mode: 'development',
    watch: true,
    devtool: 'inline-source-map',
    plugins: [
      ElectronReloadPlugin(),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          '**/*',
          '!preload*',
        ],
      }),
    ],
  }),
  merge(common.preload, {
    mode: 'development',
    watch: true,
    devtool: 'inline-source-map',
    plugins: [
      ElectronReloadPlugin(),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          '**/*',
          '!main*',
          '!packages/**',
          '!screens/**',
        ],
      }),
      new WebpackShellPlugin({
        onBeforeBuild:{
          scripts: ['yarn pretypecheck-renderer'],
          blocking: true,
          parallel: false
        },
      }),
    ],
  }),
];