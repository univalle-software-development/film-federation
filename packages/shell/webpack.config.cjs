// packages/shell/webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');
const path = require('path');
const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/main.jsx', // Your current entry point
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 5000,
    historyApiFallback: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
    }
  },
  output: {
    publicPath: 'http://localhost:5000/', // URL where shell is served
    // filename: 'bundle.js',
    // path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, '../shared-components/src')
        ],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            configFile: path.resolve(__dirname, '../../babel.config.js')
          }
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        // This key must match the remoteName you pass to MFEComponentLoader
        mfeFilmCatalog: 'mfeFilmCatalog@http://localhost:5001/remoteEntry.js'
      },
      shared: {
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        // any other shared libs…
      },
    }),
    new HtmlWebpackPlugin({ template: './index.html' }),
  ],
};