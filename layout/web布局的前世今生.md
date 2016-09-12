##web布局的前世今生

前端工程师，很多工作是和布局打交道，现在和大家介绍一下布局的前世今生

下面，我将会用web不同时代的不同的方式，实现经典的圣杯布局。圣杯布局是web最基础的布局之一，很多布局是由此布局演变而来

![F](http://www.alistapart.com/d/holygrail/diagram_05.gif)   
**圣杯布局**
####table布局的上古时代

用table布局实现较简单，三行三列，header,footer三列合并，实现代码如下：

实现代码

```css
table
{
    border-collapse:collapse;
    width:100%;
    height:100%;
}

#header,#footer
{
    height:80px;
    background-color:#fdf;
}

#leftbar,#main,#rightbar
{
    height:100%;
}

#main
{
    width:68%;
}

```
``` html
<table>
    <tr>
        <td colspan="3" id="header">
            #header
  </td>
    </tr>
    <tr>
        <td id="leftbar">leftbar</td>
        <td  id="main">main</td>
        <td id="rightbar">rightbar</td>
    </tr>
    <tr>
        <td colspan="3" id="footer">footer</td>
    </tr>
</table>
```
咋一看，实现代码简单清晰，没有任何兼容性问题。
但是只要布局一复杂，就会带来以下问题。
1. colspan，rowspan不能写在css中，不能复用。
2. 一个table中各tr中colspan,必须相同，不同时会出现样式错乱，需求变更，布局变复杂时，在任何一行添加td,其它行都要变更，耦合大。没有可读性和可维护性。
3. table是用来显示数据，而不是布局，不够规范，没有实现语义化。
4. 网友反馈有性能问题，表格内所有的加载完成才显示，未证实。
5. 当前table如果需充满父节点，父节点的高步必须固定，如果以上在body中，必须加以下代码
``` css
body,html
{
    height: 100%;
    width: 100%;
}
```
正因为以下缺点，后面出现了div+css.


####规范初现，div+css

``` css
.header,.footer
{
    height:80px;
    background-color:#fdf;
}
.leftside,.main,.rightside
{
    float: left;
    height: 100%;
}

.main
{
    width:68%;
}

.leftside,.rightside
{
    width: 16%;
}
.main-con
{
   height: 800px;
}
```

```html
<div class="header"></div>
<div class="main-con">
    <div class="leftside"></div>
    <div class="main"></div>
    <div class="rightside"></div>
</div>
<div class="footer"></div>
```


div+css解决了复用的问题，维护性也不错，同时，只要定义好class,可读性也不错。。。
是当前互联网主要的布局方式。



但是还是有经下缺陷：
1. 绝对居中还需要hack来实现。[绝对居中的方法](http://blog.csdn.net/freshlover/article/details/11579669),代码没有自解释。
2. 如果需要充满父节点，需要用绝对定位等其它技术。
3. block的块布局需要浮动，为了防止塌缩，需要的父级的后加：after清除浮动，inline-block布局会出现间隙问题，先设置font-size为零。再恢复。两者者需要做与布局无关的操作。
4. 宽度不能自适应。

####走向新时代 html5+css,弹性布局

``` css
```

``` html
```


弹性布局通过设置容器和元素的属性，解决了以上所有问题，同时借助html5,实现了语义化。

但是会带来一个问题，兼容性，

不兼容IE10以下的浏览器，

web,由于各厂商各持自家标准，不统一，导致标准发展缓慢，,可怜fer.

