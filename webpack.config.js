var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: "./app/index.js",
    output: {
        path: __dirname + '/public',
        filename: "bundle.js",
    },
    module : {
        rules : [{
            test: /.js$/,
            include: path.join(__dirname , "app"),
            use : {
                loader:"babel-loader",
            }
        }]
    }
}