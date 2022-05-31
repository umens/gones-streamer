const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  electron:
  {
    entry: {
      main: './electron/main.ts',
      // preload: './electron/preload.ts',
    },
    target: 'electron-main',
    node: {
      __dirname: false
    },
    // externals: {
    //   'obs-studio-node': "require('obs-studio-node')",
    // },
    plugins: [
      // new HtmlWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env.FLUENTFFMPEG_COV': false
      }),
      new CopyPlugin({
        patterns: [
          { from: path.resolve(__dirname, 'screens'), to: path.resolve(__dirname, '../build/screens'), },
          // { from: 'other', to: 'public' },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      path: path.resolve(__dirname, '../build'),
    },
  },
  preload: {
    entry: {
      preload: './electron/preload.ts',
    },
    target: 'electron-preload',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    // externals: {
    //   'obs-studio-node': "require('obs-studio-node')",
    // },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      path: path.resolve(__dirname, '../build'),
    },
  }
};