const { merge } = require("lodash");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const base = require("./webpack.base.config");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = merge(base, {
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Resonate",
    }),
  ],
  devtool: "inline-source-map",
  devServer: {
    historyApiFallback: true,
    port: 8081,
    hot: false,
    liveReload: false,
    client: false,
    allowedHosts: "all",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
});
