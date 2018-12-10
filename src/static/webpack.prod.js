'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  output: {
    path: path.resolve(__dirname, '..', '..', 'lib/static')
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'HTML report',
      filename: 'index.html',
      template: 'template.html',
      chunks: ['report']
    }),
    new HtmlWebpackPlugin({
      title: 'Gui report',
      filename: 'gui.html',
      template: 'template.html',
      chunks: ['gui']
    }),
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
