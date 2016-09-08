//generator
function* test(p){
    console.log(p); // 1
    var a = yield p + 1;
    console.log(a); // 3
}

var g = test(1);
var ret;
ret = g.next();
console.log(ret); // { value: 2, done: false }
ret = g.next(ret.value + 1);
console.log(ret); // { value: undefined, done: true }

console.log("---------------delay-------------------")

import co from 'co';
co(function* (){
    var now = Date.now();
    yield sleep(150);
    console.log(Date.now() - now);
});

function sleep(ms){
    return function(cb){
        setTimeout(cb, ms);
    };
}

console.log("---------------fetch data-------------------")
import fetch from 'node-fetch'

co(function* (){
    let result= yield fetch('https://api.github.com/users/etoah')
    let json =yield result.json()
    console.log("result:",json)
});

//处理并发

//数组的写法
co(function* () {
  var res = yield [
    Promise.resolve(1),
    Promise.resolve(2)
  ];
  console.log(res);
}).catch(()=>{});