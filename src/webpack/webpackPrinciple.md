

## 准备工作
#### 配置

这里只介绍vscode配置， webstorm调试原理差不多，配置应该不异。


![](http://images2015.cnblogs.com/blog/585323/201611/585323-20161119172021638-942180638.gif)


在launch.json里修改入口文件即可。

```json
        {
            "type": "node",
            "request": "launch",
            "name": "node debug",
            "program": "${workspaceRoot}/src/vscode/index.js",
            "cwd": "${workspaceRoot}"
        }
```

对于webpack, gulp 这类命令行的应用，还需要手动添加一个入口，以webpack为例：
1. 添加webpack.debug.js：  

```javascript
var path = require('path');

require('child_process').exec("npm config get prefix", function(err, stdout, stderr) {
    console.log("stdout:",stdout)
    var nixLib = (process.platform.indexOf("win") === 0) ? "" : "lib"; // win/*nix support

    var webpackPath = path.resolve(path.join(stdout.replace("\n", ""), nixLib, 'node_modules', 'webpack', 'bin', 'webpack.js'));
    require(webpackPath);
});
```
原理也简单， 手动调用webpack命令行文件。

2. 在launch.json文件中修改入口文件和执行路径:
```json
{
    "type": "node",
    "request": "launch",
    "name": "webpack debug",
    "program": "${workspaceRoot}/src/webpack/webpack.debug.js",
    "cwd": "${workspaceRoot}/src/webpack"
}
```

然后启动调试即可。

## 开发插件

### webpack 原理

compilation
compiler

### 编写loader
```javascript
var  debug = require('debug')('InfoLoader');
// Cacheable identity loader
module.exports = function(source,map) {
    this.cacheable();
    debug(">>>>>this.query:",this.query);
    source+=";console.log('infoloader');";
    return source;
};
```
自定义(非npm包)的loader，注意定义解析：

```javascript
    resolveLoader: {
        alias: {
            "info": path.join(__dirname, "./loader/infoLoader")
        }
    },
```

### 编写plugin

```javascript
var  debug = require('debug')('InfoPlugin');
function InfoPlugin(options) {
}
InfoPlugin.prototype.apply = function (compiler) {
    // Setup callback for accessing a compilation:
    compiler.plugin("compilation", function (compilation,params) {
        // Now setup callbacks for accessing compilation steps:
        compilation.plugin("optimize", function () {
            debug(">>>hook:optimize");
            debug(">>>hook:optimize");            
            
        });
        compilation.plugin('before-hash', function(){
            debug(">>>hook:before-hash");            
        });
    });
    compiler.plugin("context-module-factory", function(){
        debug(">>>hook:context-module-factory");
    });
    
    compiler.plugin("before-compile", function(){
        debug(">>>hook:before-compile");
    });
    
    compiler.plugin("compile", function(){
        debug(">>>hook:compile");
    });
};

module.exports = InfoPlugin;
```
怎么快速的编写插件：找到一个类似(作用时间，功能范围)插件来修改。


