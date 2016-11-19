var infoPlugin = require("./plugin/infoPlugin");
var path = require('path');
module.exports = {
      // 入口文件，是模块构建的起点，同时每一个入口文件对应最后生成的一个 chunk。
    entry: "./entry.js",
    // 生成文件，是模块构建的终点，包括输出文件与输出路径。
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    // 这里配置了处理各模块的 loader ，包括 css 预处理 loader.
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

     // webpack 各插件对象，在 webpack 的事件hook中执行对应的方法。
    plugins: [
        new infoPlugin()
    ]
};