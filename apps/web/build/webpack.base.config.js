const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "../dist"),
    publicPath: "http://localhost:8081/",
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules(?!\/@chakra-ui)/,
        use: [{ loader: "babel-loader" }],
      },
      {
        test: /\.less$/i,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: { javascriptEnabled: true },
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "../src/"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
};
