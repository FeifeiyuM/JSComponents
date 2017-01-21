# 图片上传组件 #

> 本文介绍一款图片上传组件，基于原生 javascript 编写， 不依赖于其他框架  

## Yupload 特点 ##
> 基于表单提交， 原生 javascript 实现，兼容性好  
> 支持多个图片上传请求同时发出，将按照提交请求的先后顺序依次上传    
> API接口返回结果必须为 JSON 格式字符串   
> 问题： 1、如果为 input[type="file"] 元素绑定了事件， 在图片上传后需要重新为该元素注册事件
> 2、如果图片上传失败，即返回状态不是 200, 且返回结果为JSON格式的字符串， 该组件无法区分出错误类型，需要开发人员自己判断

## Yupload 使用 ##
> 1、图片上传元素编写 
> **注意 input[type="file] 标签中的 name 标签不能漏， 就是上传图片时对应的字段  
```html
<div class="upload" id="upload">
    <input type="file" class="upfile" name="file" id="upfile1">
    <input type="button" id="to-upload1" value="上传1"> <br>
    <input type="file" class="upfile" name="file" id="upfile2">
    <input type="button" id="to-upload2" value="上传2">
</div>
```
> 2、初始化
> - 参数1: url, 图片提交地址, 类型 string, 不能为空
> - 参数2： csrftoken, 表单提交时需要提供的 csrftoken, 类型object, 包含属性 name: csrftoken 字段名称， value: csrftoken 值, 非必填，根据接口需要配置  
> - 参数3： hideField, 上传图片时需要携带的其他字段， 类型 Array, 数组元素由对象构成， 对象属性包括： name 字段名， value 字段值。  

> **例：**
```javascript
let options = {
    url: '/common/api/upload/image/',  //图片提交地址
    csrftoken: { name: 'csrfmiddlewaretoken', value: csrftoken },  //django 框架的 csrftoken 
    hideField: [{name: 'tag', value: 123}]  //添加的其他字段  
}
let yUpload = new Yupload(options)  // 初始化 
```
> 初始化后会在 &lt;body>中生成如下元素  
```html
<div id="yupload-wrap" style="display: none;">
    <iframe id="yupload-iframe" name="yupload-iframe" style="display: none;"></iframe> 
    <form target="yupload-iframe" id="yupload-form" method="POST" enctype="multipart/form-data" action="/common/api/upload/material/">
        <input type="hidden" name="csrfmiddlewaretoken" value="bbX3XLXGOPrF4EbGMtP2eG5VYgGUVHyPYgL7zw9pNUgW6ABCoMQLhWWFzX7DIZ4U">
        <div id="yupload-fields">
            <input type="hidden" name="tag" value="1233">
            <input type="file" class="upfile" name="file" id="uploading-file">
        </div>
    </form>
</div>
```
> 3、触发图片上传   
> 调用 Yupload 的方法 trigger 来触发图片上传， 在 trigger 方法中可以传递的参数如下：  
> - url: 修改图片上传地址， 类型 string, 非必填  
> - hideField: 修改随图片一起上传的参数， 数据格式和初始化时一样， 注意：使用此参数时会清空 初始化时 hideField 传入的所有参数  
> - target: 需要上传的内容的 input[type="file"] 标签， 必填， target 接受以下两类数据   
>   - input 标签的 id 属性， 类型 string, 
>   - input 标签的 dom 对象， 类型 HTMLInputElement， 
> - callback 函数， 函数的第一参数为 error, 如果 error 不为空则说明图片上传出错， 第二个参数为接口返回的结果，类型 object    

> **例：**
``` javascript
$('#to-upload1').click(function() {
    let options = {
        target: $('#upfile1')[0],
        hideField: [{name: 'tag', value: 1}],
    }
    yUpload.trigger(options, (err, resp) => {
        console.log('img1', resp)
    })
})
$('#to-upload2').click(function() {
    let options = {
        url: '/common/api/upload/pdf/',
        target: $('#upfile2')[0],
        hideField: [{name: 'tag', value: 2}],
    }
    yUpload.trigger(options, (err, resp) => {
        console.log('img2', resp)
    })
})
```