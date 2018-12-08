'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  output: {
    filename: 'report.min.js',
    path: path.resolve(__dirname, '..', '..', 'lib/static')
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_console: true,
          unsafe: true
        }
      }
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV'])
  ]
});
