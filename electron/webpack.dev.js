const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ElectronReloadPlugin = require('webpack-electron-reload')({
  path: path.join(__dirname, '../build/main.bundle.js'),
});
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  watch: true,
  devtool: 'inline-source-map',
  plugins: [
    ElectronReloadPlugin(),
    new CleanWebpackPlugin(),
  ],
});