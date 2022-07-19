// @ts-check
const autoprefixer = require('autoprefixer')
const prefixer = require('postcss-prefixer')
const clean = require('postcss-clean')
const webpack = require('webpack')
const pkg = require('../package.json')
const path = require('path')

process.traceDeprecation = true

const nodeModDir = path.resolve('./node_modules/') + '/'
const srcDir = path.resolve('./src') + '/'
const banner = pkg.name + ' v' + pkg.version + ' ' + pkg.homepage

/** @type {webpack.RuleSetUseItem} */
const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        prefixer({
          prefix: '_',
          ignore: [/luna-console/, /luna-object-viewer/, /luna-notification/],
        }),
        autoprefixer(),
        clean(),
      ],
    },
  },
}

/** @type {webpack.RuleSetUseItem} */
const cssMinifierLoader = {
  loader: path.resolve(__dirname, './loaders/css-minifier-loader'),
  options: {},
}

/** @type {webpack.Configuration} */
module.exports = {
  entry: './src/index',
  resolve: {
    symlinks: false,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '../test'),
    },
    port: 8080,
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/assets/',
    library: {
      type: 'module',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules|index\.js/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          cssMinifierLoader,
          { loader: 'css-loader', options: { exportType: 'string' } },
          postcssLoader,
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          cssMinifierLoader,
          { loader: 'css-loader', options: { exportType: 'string' } },
          postcssLoader,
        ],
      },
      // https://github.com/wycats/handlebars.js/issues/1134
      {
        test: /\.hbs$/,
        use: [
          {
            loader: path.resolve(
              __dirname,
              './loaders/handlebars-minifier-loader.js'
            ),
            options: {},
          },
          {
            loader: nodeModDir + 'handlebars-loader/index.js',
            options: {
              runtime: srcDir + 'lib/handlebars.js',
              knownHelpers: ['class', 'repeat', 'concat'],
              precompileOptions: {
                knownHelpersOnly: true,
              },
            },
          },
          {
            loader: 'html-minifier-loader',
            options: {
              ignoreCustomFragments: [/\{\{\{[^}]+\}\}\}/, /\{\{[^}]+\}\}/],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin(banner),
    new webpack.DefinePlugin({
      VERSION: `"${pkg.version}"`,
    }),
  ],
  experiments: {
    outputModule: true,
  },
}
