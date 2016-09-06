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

//fetch('https://api.github.com/users/etoah').then((data)=>console.log("data:",data))
// fetch('https://api.github.com/users/github')
//     .then(function(res) {
//          console.log(res.json().then(a=>console.log("a,",a)));
//     })

// co(function* (){
//     let result= yield fetch('https://api.github.com/users/etoah')
//     let json =yield result.json()
//     console.log("result:",json)
// });

import * as request from 'request'
co(function* (){
    let result= yield request.get('https://www.baidu.com/')
    console.log("result:",result)
});

// request.get('https://www.baidu.com/', function (error, response, body) {
//     console.log(body) // Show the HTML for the Google homepage.
// })

//处理并发

// 数组的写法
// co(function* () {
//   var res = yield [
//     Promise.resolve(1),
//     Promise.resolve(2)
//   ];
//   console.log(res);
// }).catch(()=>{});