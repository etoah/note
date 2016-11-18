function InfoPlugin(options) {

}

InfoPlugin.prototype.apply = function (compiler) {
    // Setup callback for accessing a compilation:
    compiler.plugin("compilation", function (compilation,params) {
        // Now setup callbacks for accessing compilation steps:
        compilation.plugin("optimize", function () {
            console.info(">>>hook:optimize");
            // console.log("---------------start------------------");
            // console.log("compiler:",compiler);
            // console.log("---------------gap------------------\n\n\n\n");            
            // console.log("compilation:",compilation,params);
            // console.log("---------------end------------------");
            console.info(">>>hook:optimize");            
            
        });
        compilation.plugin('before-hash', function(){
            console.info(">>>hook:before-hash");            
        });
    });
    compiler.plugin("context-module-factory", function(){
        console.info(">>>hook:context-module-factory");
    });
    
    compiler.plugin("before-compile", function(){
        console.info(">>>hook:before-compile");
    });
    
    compiler.plugin("compile", function(){
        console.info(">>>hook:compile");
    });
    
    //why
    // compiler.plugin("make", function(){
    //     console.info(">>>hook:make");
    // });


};

module.exports = InfoPlugin;