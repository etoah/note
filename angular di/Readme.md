

依赖注入（Dependency Injection，简称DI）是像C#,java等典型的面向对象语言框架设计原则控制反转的一种典型的一种实现方式，angular把它引入到js中，介绍angular依赖注入的使用方式的文章很多，
[angular官方的文档](https://docs.angularjs.org/guide/di),也有很详细的说明。但介绍原理的较少，angular代码结构较复杂，文章实现了一简化版本的DI,核心代码只有30行左右,[相看实现效果（可能需翻墙）](http://plnkr.co/edit/sJiIbzEXiqLLoQPeXBnR?p=preview)或查看[源码](https://github.com/etoah/Eg/blob/master/Angular/di.html)

这篇文章用尽量简单的方式说一说 angular依赖注入的实现。


## 简化的实现原理
要实现注入，基本有三步：
1. 得到模块的依赖项
2. 查找依赖项所对应的对象
3. 执行时注入

### 1. 得到模块的依赖项
javascript 实现DI的核心api是`Function.prototype.toString`,对一个函数执行toString，它会返回函数的源码字符串，这样我们就可以通过正则匹配的方式拿到这个函数的参数列表：   

```js
function extractArgs(fn) { //angular 这里还加了注释、箭头函数的处理
			var args = fn.toString().match(/^[^\(]*\(\s*([^\)]*)\)/m);
			return args[1].split(',');
		}
```


### 2. 查找依赖项所对应的对象
java与.net通过反射来获取依赖对象，js是动态语言，直接一个`object[name]`就可以直接拿到对象。所以只要用一个对象保存对象或函数列表就可以了   

```js
function createInjector(cache) {
			this.cache = cache;

		}
angular.module = function () {
			modules = {};
			injector = new createInjector(modules);
			return {
				injector: injector,
				factory: function (name, fn) {
					modules[name.trim()] = this.injector.invoke(fn); 
					return this;
				}
			}
		};
```

### 3. 执行时注入

最后通过 fn.apply方法把执行上下文，和依赖列表传入函数并执行：   

```js

createInjector.prototype = {
			invoke: function (fn, self) {
				argsString = extractArgs(fn);
				args = [];
				argsString.forEach(function (val) {
					args.push(this.cache[val.trim()]);
				}, this);
				return fn.apply(self, args);
			}
		};

```

简化的全部代码和执行效果见(可能需翻墙)：[http://plnkr.co/edit/sJiIbzEXiqLLoQPeXBnR?p=preview](http://plnkr.co/edit/sJiIbzEXiqLLoQPeXBnR?p=preview)   
或查看[源码](https://github.com/etoah/Eg/blob/master/Angular/di.html)

这里是简化的版本，实际angular的实现考虑了很多问题，如模块管理，延迟执行等 


## angular 的实现

为了简单，我们也按这三步来介绍angular DI

1. 得到模块的依赖项
2. 查找依赖项所对应的对象
3. 执行时注入

注：以下代码行数有就可能变
### 1. 得到模块的依赖项

https://github.com/angular/angular.js/blob/master/src%2Fauto%2Finjector.js#L81   

```js 
var ARROW_ARG = /^([^\(]+?)=>/;
var FN_ARGS = /^[^\(]*\(\s*([^\)]*)\)/m;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

function extractArgs(fn) {
  var fnText = fn.toString().replace(STRIP_COMMENTS, ''),
      args = fnText.match(ARROW_ARG) || fnText.match(FN_ARGS);
  return args;
}
```

### 2. 查找依赖项所对应的对象

https://github.com/angular/angular.js/blob/master/src%2Fauto%2Finjector.js#L807    
```js
    function getService(serviceName, caller) {
      if (cache.hasOwnProperty(serviceName)) {
        if (cache[serviceName] === INSTANTIATING) {
          throw $injectorMinErr('cdep', 'Circular dependency found: {0}',
                    serviceName + ' <- ' + path.join(' <- '));
        }
        return cache[serviceName];
      } else {
        try {
          path.unshift(serviceName);
          cache[serviceName] = INSTANTIATING;
          return cache[serviceName] = factory(serviceName, caller);
        } catch (err) {
          if (cache[serviceName] === INSTANTIATING) {
            delete cache[serviceName];
          }
          throw err;
        } finally {
          path.shift();
        }
      }
    }
```

### 3. 执行时注入
https://github.com/angular/angular.js/blob/master/src%2Fauto%2Finjector.js#L831   

####得到参数：
```js
    function injectionArgs(fn, locals, serviceName) {
      var args = [],
          $inject = createInjector.$$annotate(fn, strictDi, serviceName);

      for (var i = 0, length = $inject.length; i < length; i++) {
        var key = $inject[i];
        if (typeof key !== 'string') {
          throw $injectorMinErr('itkn',
                  'Incorrect injection token! Expected service name as string, got {0}', key);
        }
        args.push(locals && locals.hasOwnProperty(key) ? locals[key] :
                                                         getService(key, serviceName));
      }
      return args;
    }
```
#### 调用
https://github.com/angular/angular.js/blob/master/src%2Fauto%2Finjector.js#L861     

```js
    function invoke(fn, self, locals, serviceName) {
      if (typeof locals === 'string') {
        serviceName = locals;
        locals = null;
      }

      var args = injectionArgs(fn, locals, serviceName);
      if (isArray(fn)) {
        fn = fn[fn.length - 1];
      }

      if (!isClass(fn)) {
        // http://jsperf.com/angularjs-invoke-apply-vs-switch
        // #5388
        return fn.apply(self, args);
      } else {
        args.unshift(null);
        return new (Function.prototype.bind.apply(fn, args))();
      }
    }
```

### angular模块管理，深坑

angular在每次应用启动时，初始化一个Injector实例：

https://github.com/angular/angular.js/blob/master/src/Angular.js#L1685    
```js
var injector = createInjector(modules, config.strictDi);
```

由此代码可以看出对每一个Angular应用来说，无论是哪个模块，所有的"provider"都是存在相同的providerCache或cache中

所以会导致一个被誉为angular模块管理的坑王的问题：
module 并没有什么命名空间的作用，当依赖名相同的时候，后面引用的会覆盖前面引用的模块。

具体的示例可以查看：

http://plnkr.co/edit/TZ7hpMwuxk0surlcWDvU?p=preview

>注：angular di用本文的调用方式压缩代码会出问题：可以用[g-annotate](https://www.npmjs.com/search?q=ng-annotate)转为安全的调用方式。

到此angular di的实现原理已完成简单的介绍，angular用了项目中几乎不会用到的api：Function.prototype.toString 实现依赖注入，思路比较简单，但实际框架中考虑的问题较多，更加详细的实现可以直接看[angular的源码](https://github.com/angular/angular.js)。

以后会逐步介绍angular其它原理。


