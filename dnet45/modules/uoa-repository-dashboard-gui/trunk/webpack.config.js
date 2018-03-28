/*
*   !!! ADD REAL API ADDRESSES BEFORE PRODUCTION !!!!
*/

var webpack = require('webpack');
var path = require('path');
var webpackMerge = require('webpack-merge');
const AotPlugin = require('@ngtools/webpack').AotPlugin;

// Webpack Config
var webpackConfig = {
  entry: {
    'main': './app/main.ts',
    'vendor': './app/vendors.ts',
    'polyfills': './app/polyfills.ts',
  },

  output: {
    publicPath: '/dist/',
    path: path.resolve(__dirname, './dist'),
  },

  plugins: [
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
      path.resolve(__dirname, './'),
      {
        // your Angular Async Route paths relative to this root directory
      }
    ),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    })
  ],

  module: {
    loaders: [
      {test: /\.css$/, loaders: ['to-string-loader', 'css-loader']},
      {test: /\.html$/, loader: 'raw-loader'},
      {test: /\.scss$/, loaders: ['style', 'css', 'postcss', 'sass']},
      {test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url?limit=10000'},
      {test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery'}
    ]
  },

};


// Our Webpack Defaults
var defaultConfig = {
  devtool: 'source-map',

  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(__dirname, 'node_modules')]
  },

  devServer: {
    historyApiFallback: true,
    watchOptions: {aggregateTimeout: 300, poll: 1000},
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },

  node: {
    global: true,
    crypto: 'empty',
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: false,
    clearImmediate: false,
    setImmediate: false
  }
};


module.exports = function (env) {
  console.log(env);
  if ((typeof env == 'undefined') || (!env.release && env.release != true)) {
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        "process.env": {
          PRODUCTION: JSON.stringify(false),
          API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT || "http://aleka.athenarc.gr:8380/repomanager-service-dev"),
          FAQ_ENDPOINT: JSON.stringify(process.env.FAQ_ENDPOINT || "http://aleka.athenarc.gr:5555/api"),
          WORKFLOW_API_ENDPOINT: JSON.stringify(process.env.WORKFLOW_API_ENDPOINT || "http://aleka.athenarc.gr:3000"),
          AAI_ENDPOINT: JSON.stringify(process.env.AAI_ENDPOINT || "http://aleka.athenarc.gr:8380/repomanager-service-dev/openid_connect_login")
        }
      })
    );
    webpackConfig.module.loaders.push(
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
          'angular2-template-loader',
          'angular2-router-loader'
        ]
      }
    );
  } else {
    webpackConfig.plugins.push(
      new AotPlugin({
        tsConfigPath: 'tsconfig.json',
        entryModule: path.resolve(__dirname, './app/app.module#AppModule')
      })
    );
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        "process.env": {
          PRODUCTION: JSON.stringify(true),
          API_ENDPOINT: JSON.stringify("http://aleka.athenarc.gr:8380/repomanager-service-dev"),
          FAQ_ENDPOINT: JSON.stringify("http://aleka.athenarc.gr:5555/api"),
          WORKFLOW_API_ENDPOINT: JSON.stringify("http://aleka.athenarc.gr:3000"),
          AAI_ENDPOINT: JSON.stringify("http://aleka.athenarc.gr:8380/repomanager-service-dev/openid_connect_login")
        }
      })
    );
    webpackConfig.module.loaders.push(
      {
        test: /\.ts$/,
        loaders: [
          '@ngtools/webpack'
        ]
      }
    );
  }
  return webpackMerge(defaultConfig, webpackConfig);
};
