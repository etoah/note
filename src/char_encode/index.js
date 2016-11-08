var he = require('he');
const rawStr="©   1234 < > &  etoah  中文"
var str=(he.encode(rawStr));
console.log('encode:',str);
console.log('decode:',he.decode(str))

var encodedStr = rawStr.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
   return '&#'+i.charCodeAt(0)+';';
});

console.log('encodedStr:',encodedStr);
console.log('decodedStr:',he.decode(encodedStr));