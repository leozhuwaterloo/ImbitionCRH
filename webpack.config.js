"use strict";

const path = require("path")
const webpack = require('webpack')
const BundleTracker = require('webpack-bundle-tracker')

module.exports = {
  context: __dirname,

  entry: path.resolve('./ImbitionProject/static/webpack/js/index.js'),

  output: {
    path: path.resolve('./ImbitionProject/static/webpack/bundles/'),
    filename: "[name].js",
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Popper: 'popper.js',
      Util: 'exports-loader?Util!bootstrap/js/dist/util'
    }),
    new BundleTracker({path: __dirname, filename: './webpack-stats.json'})
  ],

  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: ['babel-loader', 'eslint-loader'], exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader']},
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'], exclude: /node_modules/ }
    ],
  },

  mode: 'development',
}
