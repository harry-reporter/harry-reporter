const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/static/index.tsx',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
            "style-loader",
            "css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]",
            "sass-loader"
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', 'jsx' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'src', 'static')
  },
  devServer: {
    contentBase: path.join(__dirname, 'src', 'static'),
    compress: true,
    port: 9000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'static', 'template.html')
    })
  ]
};
