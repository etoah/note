var infoPlugin = require("./plugin/infoPlugin");
var path = require('path');
module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: "style!css"
        }, {
            test: /\.js$/,
            loader: "info?a=1"
        }]
    },
    resolveLoader: {
        alias: {
            "info": path.join(__dirname, "./loader/infoLoader")
        }
    },
    plugins: [
        new infoPlugin()
    ]
};