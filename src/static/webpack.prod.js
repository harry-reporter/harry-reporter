'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const merge = require('webpack-merge');
const path = require('path');

const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: {
    report: ['./index.tsx'],
    gui: ['./index.tsx']
  },
  output: {
    path: path.resolve(__dirname, '..', '..', 'lib/static')
  },
  optimization: {
    minimize: true
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
    new HtmlWebpackIncludeAssetsPlugin({
      files: ['index.html'],
      assets: ['data.js'],
      append: false
    })
  ]
});
