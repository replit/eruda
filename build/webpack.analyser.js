const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

exports = require('./webpack.prod')

exports.plugins.push(new BundleAnalyzerPlugin())

module.exports = exports
