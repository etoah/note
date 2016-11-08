
# javascript 如何列出全局对象window的非原生属性。
## Why

研究一个网站前端技术的时候，了解它的全局的对象是一个好的入口，
一般来说，常见的库就会用外观模式，最后暴露一个对象给用户调用，
比如jQuery,requirejs,angular,react
均是用这种方式。

如果没有用cmd/amd模块化或类似webpack工具打包的话，会给全局对象window添加一个属性，如angular:   
![](http://images2015.cnblogs.com/blog/585323/201611/585323-20161107154438889-1981509001.png)    
   
如React   
![](http://images2015.cnblogs.com/blog/585323/201611/585323-20161107165638983-170144089.png)


同时，为了避免全局污染，也要关注全局变量的个数和详情。


## How

可以通过ES5的新增api(Object.keys)看浏览器全局变量列表：`Object.keys(window)`

发现一般的网站都有两百多个全局变量，人力去看且需要区分是否是用户定义的比较困难，需要一个`script`去列出所有的非原生的全局属性.

开始想的是能不能防篡改对象的相关检测api(Object.isExtensible,Object.isSealed,Object.isFrozen)来判断是否原生api？

但并不是所有的原生对象都是seaded. 所以此方法行不通。

那么能不能有一个纯净的、没有加载第三方库的全局对象？

对于浏览器环境，我们有iframe

可以添加一个iframe,然后对比当前的window，就可以得到详细列表。


```javascript
var iframe = document.createElement("iframe");
document.body.appendChild(iframe);
Object.keys(iframe.contentWindow).length

```

列出非原来对象

```javascript
(function(){
    var iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    var originWindow=iframe.contentWindow,
        currentWindow=window
    var origin =Object.keys(originWindow),
        current =Object.keys(currentWindow),
        extendAttr={};
    current.forEach((key)=>{
        if(originWindow[key]===undefined){
            extendAttr[key]=currentWindow[key]
        };
    })
    console.log(`origin window:${origin.length},current window:${current.length},extentAttr:${Object.keys(extendAttr).length}`)
    console.log("extendAttr:",extendAttr);
    document.body.removeChild(iframe);
})();

```
cnblogs的全局对象：     
![](http://images2015.cnblogs.com/blog/585323/201611/585323-20161108165450702-67997046.png)


### Node怎么处理

由于node没有像Chrome Dev Tools Console一样的工具，可以直观简单的执行js代码片段，

对于Nodejs，可以在应用运行稳定(所有的全局，单例对象都初始化完成)后，再导出全局对象，

再在同一环境，不导入任何库导出全局对象，进行对比即可。



### 怎么知道一个原生函数有没有覆盖

由于`Function.prototype.toString`API,对原生函数返回`[native code]` 

```javascript
setTimeout.toString()
"function setTimeout() { [native code] }"
```
但对于自定义的函数会返回源码：
```javascript
jQuery.toString()
"function (e,t){return new x.fn.init(e,t,r)}"
```
angular就是利用这一特性实现依赖注入[http://www.cnblogs.com/etoah/p/5460441.html](http://www.cnblogs.com/etoah/p/5460441.html)

可以用此特性，来检测是否是原生的api(仅适用于浏览器运行环境,node环境有差异).


一个原生属性(Object,string...)怎么检测有没有被用户重置，除了用`typeof`检测数据类型， 本人暂没有更好的方案，欢迎讨论。


