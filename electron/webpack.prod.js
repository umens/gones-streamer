const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = [
  merge(common.electron, {
    mode: 'production',
  }),
  merge(common.preload, {
    mode: 'production',
  })
];