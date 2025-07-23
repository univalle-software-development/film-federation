// packages/mfe-user-registration/webpack.config.cjs
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const deps = require('./package.json').dependencies;
const webpack = require('webpack');
// CHOOSE A UNIQUE PORT (e.g., 5005, 5006, etc.)
const MFE_PORT = 5005; // Replace X with a unique number

module.exports = {
  entry: './src/main.jsx',
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: MFE_PORT,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  output: {
    publicPath: `http://localhost:${MFE_PORT}/`,
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
      name: 'mfeUserRegistration', // Unique name for this MFE (camelCase)
      filename: 'remoteEntry.js',
      exposes: {
        './UserRegistration': './src/UserRegistration.jsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        // Add other shared dependencies as needed
      },
    }),
    new HtmlWebpackPlugin({ template: './index.html' }),
    new webpack.DefinePlugin({                              
      'process.env.API_BASE_URL': JSON.stringify('http://localhost')
    }),
  ],
};