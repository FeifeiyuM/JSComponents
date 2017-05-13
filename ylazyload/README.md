# 图片懒加载组件 Ylazyload #

博客： [图片懒加载组件 Ylazyload](https://feifeiyum.github.io//2017/05/13/front-ylazyload/)   
DEMO: 参见 demo.html

## 实现原理 ##
1、在图片不在可视区域的时候，所有图采用默认的占位图显示，而不是让浏览器加载所有的真实图片，从而减少服务器和客户机的带宽资源，实现按需提供服务的目的   
2、在页面滚动时，不断地去检测图片是否进入了可视区域， 如果进入可视区域则将默认的占位图替换成真实图片   
3、如何实现判断图片进入可视区域：  
> - 先计算出我们确定的可视区域在浏览器视窗中的坐标， visibleArea
> - 在页面滚动的时候，定期去计算每张图片在浏览器视窗中的坐标， imgCoord
> - 通过对比 visibleArea 和 imgCoord 上下左右的坐标值，即可判断出图片是否在可视区域内 
> - 本组建采用方法 [getBoundingClientRect](https://developer.mozilla.org/en/docs/Web/API/Element/getBoundingClientRect) 获取 DOM 元素的在窗口中坐标

更详细的解释可以参见博客 [细说jQuery如何实现懒加载](http://www.jianshu.com/p/e62d367c6148)

## 使用 Ylazyload ##
**1、在使用前在页面引入 Ylazyload**
```html
<!-- 引入ylazyload -->
<script src="/static/common/lazyload/ylazyload-1.0.js"></script>
```
**2、为需要懒加载的图片添加属性 ylazyload-src**
为需要懒加载图片添加 ylazyload-src 是必须的， ylazyload-src 是真实的图片地址
```html
<li>
    <img class="ylazyload" src="default-img-url" ylazyload-src="real-img-url1">
</li>
<li>
    <img class="ylazyload" src="default-img-url" ylazyload-src="real-img-url2">
</li>
<li>
    <img class="ylazyload" src="default-img-url" ylazyload-src="real-img-url3">
</li>
```
**3、初始化 Ylazyload**
```javascript
// page-main： 为可视容器元素的 id 属性
// function(dom, src): 回调函数
var yLazyload = new Ylazyload('page-main', function(dom, src) {
    console.log('src', src)
})
```
**4、添加需要懒加载的图片列表**
```javascript
 //只有在使用了 appendImgs 之后才会真正实现懒加载效果
 yLazyload.appendImgs()
 //如果是异步 js 渲染的图片， 在图片渲染结束后，相应执行 appendImgs 方法
 //刷新需要懒加载的图片列表
 function renderImgList() {
     ...
 }
 yLazyload.appendImgs()
```

## Ylazyload 参数介绍 ##
提前申明： Ylazyload 没有参数是必填的
**1、初始化： new Ylazyload(container, callback)**
container： 作用是指定可视区域容器元素, 取值可为：
> - string: 容器元素的 id 属性
> - DOM Object: 容器元素的 DOM 对象 
> - default： 为 document 对象

callback: 回调函数，返回当前加载真实地址的 img 元素 DOM 对象， 和 真实图片地址， function(dom, src) 
> - dom: 当前替换地址的 img DOM 对象
> - src: 真实图片地址 

**2、添加懒加载的图片方法 appendImgs(imgs) 参数**
> - string: img 元素的 class 属性 
> - DOM NodeList: img 元素 DOM 对象列表
> - default: 所有拥有 ylazyload-src 属性的 img 元素 
> - 如无特别需求推荐 appendImgs 方法不传参数