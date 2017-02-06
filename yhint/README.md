# 下滑式提醒组件 #

> 本文将介绍一款下滑式提醒组件， 即操作成功后在页面某个位置以下滑方式弹出提醒, 类似于toast的常见交互模式。

> 例: 上传成功， 弹出下面元素， 一定时间后消失  
> ![yhint](./yhint1.png)

> 如果选择成功的提醒, 弹层会自动关闭，  
> 选择失败的提醒， 弹层无法自动关闭， 需要用户去手动关闭   

## 参数说明 ##
> target: yhint 的容器（父级)元素的 属性 Id, 类型 string 必填  
> successBgColor: yhint 操作成功时弹层的背景色, 类型 string(颜色值), 默认 '#b3e4d1'   
> successFontColor: 操作成功提醒文字的颜色, 类型 string(颜色值), 默认 '#04a768'   
> failedBgColor: 操作失败时弹层的背景色， 类型 string(颜色值), 默认 '#ff4546'  
> failedFontColor: 操作失败提醒文字的字体颜色, 类型 string(颜色值), 默认 '#fff'  
> yhintHeight: 弹层的高度， 类型 number, default 30, 单位 'px'   
> existTime: 操作成功时，弹层停留时间, default 3000, 单位 ms   

## 使用说明 ##
### 1、html 元素 ###
> 先在页面中引入 yhint 脚本
> 在页面中添加 yhint 的容器元素   
```html
<div id="upload-hint" class="upload-hint">
</div>
```
### 2、使用 yhint ###
> 在使用 yhint 之前, 对 yhint 进行初始化 
```javascript
let yhint = new Yhint({target: 'upload-hint'})

//调用成功 hint 
yhint.success('success')
//调用失败 hint 
yhint.failed('sorry')
```