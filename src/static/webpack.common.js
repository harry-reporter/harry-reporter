'use strict';

const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const staticPath = path.resolve(__dirname);

module.exports = {
  context: staticPath,
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
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
      ]
    },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].min.css",
    }),
    new HtmlWebpackPlugin({
      template: 'template.html'
    })
  ]
};
