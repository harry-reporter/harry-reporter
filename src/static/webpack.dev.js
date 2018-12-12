'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const commonConfig = require('./webpack.common');

const isGui = process.env.GUI === 'true';

const config = merge(
  commonConfig,
  {
    entry: './index.tsx',
    devtool: 'eval-source-map',
    devServer: {
      contentBase: './',
      inline: true,
      hot: true,
      proxy: isGui
        ? { '/': 'http://localhost:8000' }
        : undefined
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  }
);

if (!isGui) {
  config.plugins.push(
    new HtmlWebpackIncludeAssetsPlugin({
      files: ['index.html'],
      assets: ['data.js'],
      append: false
    })
  );
}

module.exports = config;
