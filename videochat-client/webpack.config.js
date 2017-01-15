var webpack = require('webpack');

var appName = 'videochat';
var outputFile = appName + '.js';

var config = {
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    publicPath: __dirname + '/dist'
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/
      }
    ]
  }
};

module.exports = config;
