// @ts-check
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const config = require('./webpack.base')

config.mode =
  /** @type {webpack.Configuration["mode"]} */ (process.env.NODE_ENV) ||
  'production'
config.output.filename = 'eruda.js'
config.devtool = false
config.plugins = config.plugins.concat([
  new webpack.DefinePlugin({
    ENV: '"production"',
  }),
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: 'bundle-analyzer-report.html',
    openAnalyzer: false,
  }),
])
if (process.env.NODE_ENV === 'production') {
  config.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  }
}

module.exports = config
