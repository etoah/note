#HTTP2特性预览和抓包分析

## 背景

近年来，http网络请求量日益添加，以下是[httparchive](http://httparchive.org/trends.php?s=All&minlabel=Nov+1+2012&maxlabel=Sep+1+2016)统计，从2012-11-01到2016-09-01的请求数量和传输大小的趋势图：

![chart](https://cloud.githubusercontent.com/assets/7630567/18625558/f029e0cc-7e81-11e6-8131-39d5ae2cb982.png)

当前大部份客户端&服务端架构的应用程序，都是用http/1.1连接的，现代浏览器与单个域最大连接数，都在4-6个左右，由上图Total Requests数据，如果不用CDN分流，平均有20个左右的串行请求。
HTTP2 是1999年发布http1.1后的一次重大的改进，在协议层面改善了以上问题，减少资源占用，来，直接感受一下差异：

[HTTP/2 is the future of the Web, and it is here!](https://http2.akamai.com/demo)
这是 Akamai 公司建立的一个官方的演示，用以说明 HTTP/2 相比于之前的 HTTP/1.1 在性能上的大幅度提升。 同时请求 379 张图片，从Load time 的对比可以看出 HTTP/2 在速度上的优势。

![image](https://cloud.githubusercontent.com/assets/7630567/18613229/7246311c-7da8-11e6-80fb-562729c71069.png)

>[本文所有源码和抓包文件在github](https://github.com/etoah/note/tree/master/http2)

### HTTP/2 源自 SPDY/2

SPDY 系列协议由谷歌开发，于 2009 年公开。它的设计目标是降低 50% 的页面加载时间。当下很多著名的互联网公司都在自己的网站或 APP 中采用了 SPDY 系列协议（当前最新版本是 SPDY/3.1），因为它对性能的提升是显而易见的。主流的浏览器（谷歌、火狐、Opera）也都早已经支持 SPDY，它已经成为了工业标准，HTTP Working-Group 最终决定以 SPDY/2 为基础，开发 HTTP/2。HTTP/2标准于2015年5月以RFC 7540正式发表。

但是，HTTP/2 跟 SPDY 仍有不同的地方，主要是以下两点：

HTTP/2 支持明文 HTTP 传输，而 SPDY 强制使用 HTTPS
HTTP/2 消息头的压缩算法采用 HPACK ，而非 SPDY 采用的 DEFLATE

>协议文档请见：[rfc7540:HTTP2](https://tools.ietf.org/html/rfc7540)  

## HTTP2特性概览
### 1. 二进制协议
HTTP/2 采用二进制格式传输数据，而非 HTTP/1.x 的文本格式

![image](https://cloud.githubusercontent.com/assets/7630567/18660522/7b510934-7f43-11e6-8af2-26d10abe69d0.png)


由上图可以看到HTTP2在原来的应用层和HTTP层添加了一层二进制传输。

二进制协议的一个好处是，可以定义额外的帧。

HTTP/2 定义了近十种帧（详情可分析抓包文件），为将来的高级应用打好了基础。如果使用文本实现这种功能，解析数据将会变得非常麻烦，二进制解析则方便得多。
[RFC7540:Frame Definitions](https://tools.ietf.org/html/rfc7540#page-31)
![image](https://cloud.githubusercontent.com/assets/7630567/18627461/90325440-7e8d-11e6-90d7-4adf8a412445.png)   
**协议中定义的帧**   
 
### 2. 多路复用
HTTP/2 复用TCP连接，在一个连接里，客户端和浏览器都可以同时发送多个请求或回应，而且不用按照顺序一一对应，这样就避免了"队头堵塞"（见TCP/IP详解卷一）。
    每个 Frame Header 都有一个 Stream ID 就是被用于实现该特性。每次请求/响应使用不同的 Stream ID。就像同一个 TCP 链接上的数据包通过 IP: PORT 来区分出数据包去往哪里一样。
![image](https://cloud.githubusercontent.com/assets/7630567/18660493/52b354aa-7f43-11e6-8a21-2f6fedf2a042.png) 

[rfc7540: HTTP2 Multiplexing](https://tools.ietf.org/html/rfc7540#page-15)中对Multiplexing的说明
```
Streams and Multiplexing

   A "stream" is an independent, bidirectional sequence of frames
   exchanged between the client and server within an HTTP/2 connection.
   Streams have several important characteristics:

   o  A single HTTP/2 connection can contain multiple concurrently open
      streams, with either endpoint interleaving frames from multiple
      streams.

   o  Streams can be established and used unilaterally or shared by
      either the client or server.

   o  Streams can be closed by either endpoint.

   o  The order in which frames are sent on a stream is significant.
      Recipients process frames in the order they are received.  In
      particular, the order of HEADERS and DATA frames is semantically
      significant.

   o  Streams are identified by an integer.  Stream identifiers are
      assigned to streams by the endpoint initiating the stream.
```


### 3. 数据流   
数据流发送到一半的时候，客户端和服务器都可以发送信号（RST_STREAM帧），取消这个数据流。1.1版取消数据流的唯一方法，就是关闭TCP连接。这就是说，HTTP/2 可以取消某一次请求，同时保证TCP连接还打开着，可以被其他请求使用。

### 4. 头信息压缩：
HTTP/2 对消息头采用 [HPACK](http://http2.github.io/http2-spec/compression.html) 进行压缩传输，能够节省消息头占用的网络的流量。而 HTTP/1.x 每次请求，都会携带大量冗余头信息，浪费了很多带宽资源。    
    HTTP2对http头建立[索引表](http://http2.github.io/http2-spec/compression.html#rfc.section.A)，相同的头只发送hash table 的index, 同时还用了霍夫曼编码和传统的gzip压缩。
### 5. 服务器推送
服务端能够更快的把资源推送给客户端。例如服务端可以主动把 JS 和 CSS 文件推送给客户端，而不需要客户端解析 HTML 再发送这些请求。当客户端需要的时候，它已经在客户端了。

那么存在一个问题，如果客户端设置了缓存怎么办。有三种方式（来自社区）
- 客户端可以通过设置SETTINGS_ENABLE_PUSH为0值通知服务器端禁用推送
- 发现缓存后，客户端和服务器都可以发送信号（RST_STREAM帧），取消这个数据流。
- [cache-digest](https://github.com/h2o/cache-digest.js)(提案)
> [rfc7540: HTTP2 Server Push ](https://tools.ietf.org/html/rfc7540#page-60)
#### 6. 流优先级
    HTTP2允许浏览器指定资源的优先级。
>[rfc7540: Stream Priority](https://tools.ietf.org/html/rfc7540#page-24)


### 浏览器支持
![image](https://cloud.githubusercontent.com/assets/7630567/18593777/904a9aa2-7c6f-11e6-8e50-b1edf6b92a4e.png)

**主流浏览器都只支持 HTTP/2 Over TLS**

### node中启用http2

node中可以用spdy模块来启动应用，spdy的api,与https是一致的且主流浏览器只支持HTTP/2 Over TLS，需要配置 私钥和证书，本地自签名服务器配置可参考**引用6，7**。

```javascript
const express = require('express');
const fs =  require('fs');
const http2 = require('spdy');
const path = require('path');
const options = {
    key: fs.readFileSync('./keys/privatekey.pem'),
    cert: fs.readFileSync('./keys/certificate.pem')
};
const app = new express();
http2
  .createServer(options, app)
  .listen(8080, ()=>{
    console.log(`Server is listening on https://localhost:8080.
     You can open the URL in the browser.`)
  }
)
app.use("/",(req,res)=>{
    
  res.send("hello http2!");
})
```
如上，对于已存在的项目只要修改几行代码就可以使用http2.0了。


请求头和响应头：    
![image](https://cloud.githubusercontent.com/assets/7630567/18627369/28a74b14-7e8d-11e6-8c85-4c0d8974569f.png)
>说明：新版的Chrome，对不安全的证书（如本地的自签名服务）会降级到http1.1,firefox不会出现此问题。 

**启动server push**

```

app.get("/",(req,res)=>{
    var stream = res.push('/app.js', {   //服务器推送
    status: 200, // optional
    method: 'GET', // optional
    request: {
      accept: '*/*'
    },
    response: {
      'content-type': 'application/javascript'
    }
  })
  stream.on('error', function() {
  })
  stream.end('console.log("http2 push stream, by Lucien ");')

  res.send(`hello http2!
    <script src="/app.js"></script>`);//express 并没有host static ,这个app.js 来自push 
})
```
>[源码在github](https://github.com/etoah/note/tree/master/http2)


**响应**

![image](https://cloud.githubusercontent.com/assets/7630567/18631346/f952546e-7ea3-11e6-8858-07a1519bb7af.png)


![image](https://cloud.githubusercontent.com/assets/7630567/18631363/0e7044e6-7ea4-11e6-872a-6e9176c42c79.png)




## 抓包分析

可以用chrome 内部自带的工具(chrome://net-internals/)查看http2流量,但这个包信息量比较少，结构不如我们熟悉的Fiddler or Wireshark清晰。

Fiddler是直接作为中间代理，可以作为客户端直接与服务端通讯，可以像浏览器那样直接解密https，直接看到https报文,
但是由于[受限于.NET Framework](http://www.telerik.com/forums/http-2-support)暂不支持Http2.

用wireshark直接抓包 https：443端口的流量是这样的：
![image](https://cloud.githubusercontent.com/assets/7630567/18628348/5b523236-7e92-11e6-91e3-08529fc48fe2.png)

数据被加密了，协议细节完全看不到。
[这里](https://ismisepaul.wordpress.com/2015/03/04/http2-traffic-in-wireshark/)介绍了一种方法获取私钥解包。
抓包https包时要把代理关了，不然私钥不是同一个，wireshark不能解包（被这个坑了两小时T T）。


![image](https://cloud.githubusercontent.com/assets/7630567/18659652/876b4d7e-7f3e-11e6-8494-0631ff9ee358.png)

![image](https://cloud.githubusercontent.com/assets/7630567/18660343/721f9048-7f42-11e6-81b2-cd0e7400495e.png)

一个包内有多个不同的Steam ID

![image](https://cloud.githubusercontent.com/assets/7630567/18660190/b9bce3d4-7f41-11e6-8a6d-3c05e0514318.png)

追踪解密后TCP流可以看到，由于多路复用，各个不同的请求交替传输不同的帧，所以流数据是乱的。但在同一帧内数据还是正常的。


## 最后
最后，HTTP2有更高的传输速度，更少的资源占用，可以去除各种性能优化tricks(如css sprite,inline-image.)
转向WEB开发的美好未来T.T


## 参考资料

1. [Turn-on HTTP/2 today!](https://http2.akamai.com/)    
2. [Hypertext Transfer Protocol Version 2 (HTTP/2)](https://tools.ietf.org/html/rfc7540)    
3. [npm spdy](https://github.com/indutny/node-spdy)    
4. [npm spdy push ](https://github.com/jshttp/spdy-push)      
5. [How to create a self-signed SSL Certificate ](http://www.akadia.com/services/ssh_test_certificate.html)   
6. [HPACK: Header Compression for HTTP/2](http://http2.github.io/http2-spec/compression.html)
7. [用Node.js创建自签名的HTTPS服务器](https://cnodejs.org/topic/54745ac22804a0997d38b32d)      

