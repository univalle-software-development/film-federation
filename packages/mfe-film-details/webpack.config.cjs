// packages/mfe-film-details/webpack.config.cjs
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require(
  '@module-federation/enhanced/webpack'
);
const path = require('path');
const deps = require('./package.json').dependencies;

module.exports = {
  entry: "./src/main.jsx",
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 5002,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  output: {
    publicPath: "http://localhost:5002/",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
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
      name: "mfeFilmDetails", // Unique name for this MFE (camelCase)
      filename: "remoteEntry.js",
      exposes: {
        "./FilmDetailsApp": "./src/FilmDetailsApp.jsx",
      },
      shared: {
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        // Add other shared dependencies as needed
      },
    }),
    new HtmlWebpackPlugin({ template: './index.html' }),
  ],
};