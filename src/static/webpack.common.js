'use strict';

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const staticPath = path.resolve(__dirname);

module.exports = {
    entry: {
      report: ['./index.tsx'],
      gui: ['./index.tsx']
    },
    context: staticPath,
    output: {
        filename: '[name].min.js',
        path: staticPath
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            src: staticPath
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {minimize: true}
                    }]
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].min.css'),
        new HtmlWebpackPlugin({
            template: 'template.html'
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            files: ['index.html'],
            assets: ['data.js'],
            append: false
        })
    ]
};
