var  debug = require('debug')('InfoPlugin');

function InfoPlugin(options) {

}

InfoPlugin.prototype.apply = function (compiler) {
    // Setup callback for accessing a compilation:
    compiler.plugin("compilation", function (compilation,params) {
        // Now setup callbacks for accessing compilation steps:
        compilation.plugin("optimize", function () {
            debug(">>>hook:optimize");
            // console.log("---------------start------------------");
            // console.log("compiler:",compiler);
            // console.log("---------------gap------------------\n\n\n\n");            
            // console.log("compilation:",compilation,params);
            // console.log("---------------end------------------");
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
    
    //why
    // compiler.plugin("make", function(){
    //     debug(">>>hook:make");
    // });


};

module.exports = InfoPlugin;