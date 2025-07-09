// packages/mfe-film-catalog/webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require(
  "@module-federation/enhanced/webpack",
);
const webpack = require("webpack");
const dotenv = require("dotenv");
const path = require("path");
const deps = require("./package.json").dependencies;
dotenv.config();
module.exports = {
  entry: "./src/main.jsx", // Your current entry point
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 5001,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*", // For CORS
    },
  },
  output: {
    publicPath: "http://localhost:5001/", // URL where this MFE is served
    // filename: 'bundle.js', // In dev, filename is less critical
    // path: path.resolve(__dirname, 'dist'), // Output for production build
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "../shared-components/src"),
        ],
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            configFile: path.resolve(__dirname, "../../babel.config.js"),
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      // Add loaders for other assets if needed (images, fonts)
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mfeFilmCatalog", // must match the left‐hand of remotes above
      filename: "remoteEntry.js",
      exposes: {
        "./FilmCatalogApp": "./src/FilmCatalogApp.jsx",
      },
      shared: {
        react: { singleton: true, requiredVersion: deps.react },
        "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
      },
    }),
    new HtmlWebpackPlugin({ template: "./index.html" }),
    new webpack.DefinePlugin({
      "process.env.REACT_APP_TMDB_API_KEY": JSON.stringify(
        process.env.REACT_APP_TMDB_API_KEY ||
          dotenv.parsed?.REACT_APP_TMDB_API_KEY || "",
      ),
      "process.env.TOKEN_READ_ACCES": JSON.stringify(
        process.env.TOKEN_READ_ACCES ||
          dotenv.parsed?.TOKEN_READ_ACCES || "",
      ),
    }),
  ],
};
