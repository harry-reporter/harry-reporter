'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const commonConfig = require('./webpack.common');

module.exports = merge(
    commonConfig,
    {
        mode: 'development',
        entry: [
          './index.tsx'
        ],
        devtool: 'eval-source-map',
        devServer: {
            contentBase: './',
            inline: true,
            hot: true,
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackIncludeAssetsPlugin({
                files: ['index.html'],
                assets: ['data.js'],
                append: false
            })
          ]
    }
);
