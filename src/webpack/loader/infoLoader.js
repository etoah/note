var  debug = require('debug')('InfoLoader');
// Cacheable identity loader
module.exports = function(source,map) {
    this.cacheable();
    debug(">>>>>this.query:",this.query);
    source+=";console.log('infoloader');";
    return source;
};