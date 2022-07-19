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

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: [
      prefixer({
        prefix: '_',
        ignore: [/luna-console/, /luna-object-viewer/, /luna-notification/],
      }),
      autoprefixer,
      clean(),
    ],
  },
}

const cssMinifierLoader = {
  loader: path.resolve(__dirname, './loaders/css-minifier-loader'),
  options: {},
}

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
    library: 'eruda',
    libraryTarget: 'umd',
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
              plugins: [
                '@babel/plugin-transform-runtime',
                '@babel/plugin-proposal-class-properties',
              ],
            },
          },
          'eslint-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [cssMinifierLoader, 'css-loader', postcssLoader, 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: [cssMinifierLoader, 'css-loader', postcssLoader],
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
      VERSION: '"' + pkg.version + '"',
    }),
  ],
}
