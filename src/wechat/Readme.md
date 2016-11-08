
# 微信浏览器是移动端的IE6?微信升级内核后Html5和CSS3兼容性总结

今年(2016)4月，自从微信浏览器X5 升级Blink内核之后，各前端社区一片高潮，仿佛看到了前端er,眼含热泪进而抱头痛头的说:终于可以不用兼容这“移动端的IE6 ”了，可以早点回家了！！！    
那真实情况是不是这样呢？正好最近在做一款微信的小游戏，项目结束后，我做了一个小的总结，分享如下，时间宝贵，先上结论。



## 结论

总的来说，自从微信4月升级 X5 Blink内核之后，兼容性大大好转。
1. 安卓版的微信浏览器，全面升级为TBS2.0 (基于Android 5.0 WebView Blink内核，Chrome 37），所有版本的安卓系统均为同一内核，开发只需考虑适屏问题了，HTML5和CSS3均有较好的支持（基于Chrome 37，详情可以上caniuse查）。   
2. IOS虽说没有升级统一为同一版本的内核，但IOS版本的微信一直是WKWebView内核,WKWebView的版本依赖于IOS的版本。 IOS 8.0（下文有IOS8以下系统的占比，可忽略）以上的系统，对Html5和css3的支持率也很高，基本的H5，CSS3的特性均得到支持，测试中有详细数据。
3. 兼容性详情请查看html5和css3测试或直接用真机在以下提供的测试地址测试。

从我最近调试游戏和微信端的页面和以下测试来看，基本和媒体预期一致，Html5和Css3兼容良好。希望后面X5的Blink能够保持一定节奏的更新，不要那么多坑。


## 真机测试

### html5测试
测试地址：https://html5test.com/

测试结果：
1. honor 7:475分 安卓6.0 测试报告： https://html5test.com/s/e61f0b2ed3825842.html  
    ![image](https://gitlab.szzbmy.com/duanlongxian/TuApp/uploads/04023a9b5e8e37be5af20a66c0e8ef78/image.png)
2. vivo xplay:475分 安卓4.2 测试报告：  https://html5test.com/s/9b411b2ed390367b.html  
    ![image](https://gitlab.szzbmy.com/duanlongxian/TuApp/uploads/cba150b8bb3f61395f33e78788f509a9/image.png)
3. iphone4：401分  iOS 9.3.1  测试报告：  http://html5test.com/s/e0c5562ed81761a7.html   
    ![image](https://gitlab.szzbmy.com/duanlongxian/TuApp/uploads/a810c798b0c596c4ece62ff786f7ff90/image.png)
4. iphone6 plus: 387分  IOS 8.4 测试报告： https://html5test.com/s/e5b68e2ed8206f48.html   
    ![image](https://gitlab.szzbmy.com/duanlongxian/TuApp/uploads/363f91654a779e917de65e016f150645/image.png)

 
### css3测试


该网站不支持输出报告:(   ，只截了一个图。   
（说明，chrome 49 测试支持度为：52%，相对来说，下面浏览器的测试对CSS3的支持度还是比较高的 ）

测试地址：http://css3test.com/  

1. honor 7  安卓6.0 :49%      
    ![image](https://gitlab.szzbmy.com/duanlongxian/TuApp/uploads/2e5a87ab08ab0d7a5e2cc7acf9c23c41/image.png)
2. vivo xplay 安卓4.2：49%         
3. iphone4   iOS 9.3.1：56%
4. iphone6 plus  IOS 8.4 ：51%

注：从Layabox引擎的游戏运营统计数据上看，低于IOS 8.0的游戏用户终端占比仅为3%左右。几可忽略不计。
## FYI

### 官方人员说明
http://bbs.mb.qq.com/thread-202308-1-1.html
> 基于BLINK的新X5内核已经在手机QQ浏览器上上线了，最近在微信、手机QQ、空间上灰度。 4月份应该会全量发布。   
很抱歉给大家的开发带来了不便。   
这里介绍一下微信、手机QQ、空间内嵌X5的背景：最初是因为在微信发现系统WebView的一些安全漏洞，对微信业务影响非常严重，但是这些漏洞单纯在APP侧无法解决，所以微信提出要求内嵌X5内核替换系统WebView。后来手机QQ、空间也提出了内嵌X5的需求。所以为了APP的安全考虑，这里是不可能让前端控制用不用X5的，不然的话，恶意的网站直接跳过X5，利用系统WebView的安全漏洞，就可以获取用户的银行账号等信息了。     
内嵌X5最初是解决APP的问题，主要是APP终端开发的述求，前端同学没有参与，上线后，给前端同学带来了一些挑战，这主要是因为之前的X5内核是基于Android 4.2 WebView定制优化而来的，很多H5， CSS3属性支持是以Android 4.2系统为基础的，虽然后续我们在此基础上做了增强，但是比起Chrome的Blink内核，还是要差很多。 而Android 4.4开始，系统WebView切换到了Blink内核，所以导致在新Android机型上，X5内核的一些CSS3/H5支持弱于系统WebView。  
为了解决这个问题，去年X5内核团队，投入了全部人力，全力将X5内核升级到了Blink。 全新的X5内核基于Android 5.0系统的Blink内核，已经在15年11月份在QQ浏览器6.2版本上线，经过两个版本的迭代，现在基本稳定，近期已经开始在微信、手机QQ和空间上灰度，预期会在4月份全量上线。新内核上线后，会在新Android版本手机上对齐Chrome blink内核在前端的表现能力，同时在低版本的Android手机上也提供相同表现能力，相信会给前端同学带来更多的想象空间。



### 报道
1. [Layabox 解读微信全面升级 X5 Blink 内核](https://m.oschina.net/news/72755/layabox-weixin-x5-blink-kernel)
2. [iOS 8 HTML5性能测试：苹果有多爱HTML5？](http://www.cocoachina.com/ios/20140919/9690.html)
### 相关信息

官网：http://x5.tencent.com/

内核信息：http://x5.tencent.com/guide?id=4000
1. 内核基准从WebKit升级到Blink版本，更高的性能，更完善的H5/CSS3支持。
2. 内核版本号升级到362xx版本。 可以根据UserAgent判断当前环境是否已升级到 TBS2.0版本,包含（TBS/03xxxx）字段
3. 更完善的H5支持，HTML5跑分475
4. CSS3属性支持增强，完整支持flex
5. 更完善的filter支持
6. 支持Spdy 3.1
7. 动画性能提升
8. 支持伪元素动画效果
9. 更好的inspector支持

caniuse测试： http://res.imtt.qq.com/tbs/incoming20160419/home.html

调试方法：http://bbs.mb.qq.com/thread-1143161-1-1.html



-------

## office share

#### 微信浏览器4月升级基于Chrome37的Blink内核后 Html5和CSS3 兼容性总结
最近在做金种子的小游戏，其中用了不少的HTML5和CSS3的新特性，实现的过程中做了一些兼容性的小调查，Demo项目基本结束，做了一个小结，分享如下，时间宝贵，先上结论。
