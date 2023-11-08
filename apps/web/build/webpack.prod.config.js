const { merge } = require("lodash");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const base = require("./webpack.base.config");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = merge(base, {
  mode: "production",
  plugins: [
    new CompressionPlugin({
      deleteOriginalAssets: "keep-source-map",
      filename: "[path][base]",
    }),
  ],
});
