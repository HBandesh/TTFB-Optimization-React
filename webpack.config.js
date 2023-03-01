let path = require("path");

module.exports = {
  entry: "./app/index.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, "app"),
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
