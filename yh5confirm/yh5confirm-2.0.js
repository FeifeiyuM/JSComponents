/**
 * author: feifeiyu
 * version: 2.0
 * Yh5confirm is a simple comfirm alert component for h5
 * @param confirmText //confirm text to show
 * @param confirmTextColor  // confirm text color
 * @param confirmTextSize // confirm text font size
 * @param leftButtonText, leftButtonTextSize, leftButtonTextColor, //left button param
 * @param rightButtonText, rightButtonTextColor, rightButtonTextSize //right button param
 * yh5confirm blog: https://feifeiyum.github.io/2016/10/30/front-yh5confirm/
 */

var Yh5Confirm = (function() {
    //DOM 生成
    var genConfirmDom = function(opt) {
        var confirmWrap = document.createElement('div') 
        confirmWrap.id = 'yconfirm-wrap'
        confirmWrap.style.cssText = 'display:block;'
            + 'position:fixed;'
            + 'width:100%;'
            + 'height:100%;'
            + 'top:0;'
            + 'left:0;'
            + 'background:rgba(0,0,0,0.3);'
            + 'z-index:2001;'

        var confirmBlock = document.createElement('div')
        confirmBlock.style.cssText = 'margin:40% auto 0;'
            + 'width:70%;'
            + 'height:23%;'
            + 'border-radius:6px;'
            + 'background:#fff;'
        
        var confirmTextBlock = document.createElement('div')
        confirmTextBlock.style.cssText = 'display:table;'
            + 'width:100%;'
            + 'height:67%;'
        
        var confirmTextContent = document.createElement('p')
        confirmTextContent.id = 'yconfirm-content'
        confirmTextContent.style.cssText = 'display:table-cell;'
            + 'vertical-align:middle;'
            + 'text-align:center;'
            + 'padding:5px;'
            + 'font-size:' + (opt.confirmTextSize || '14px') + ';'
            + 'color:' + (opt.confirmTextColor || '#323232') + ';'
        confirmTextContent.innerHTML = opt.confirmText || '确定此操作？'

        var confirmBtnWrap = document.createElement('div')
        confirmBtnWrap.style.cssText = 'border-top:1px solid #d9d9d9;'
            + 'height:33%;' 

        var btnStyle = 'float:left;width:50%;height:100%;border:0;'
            + 'background:none;text-align:center;'

        var leftButton = document.createElement('input')
        leftButton.id = 'yconfirm-left-btn'
        leftButton.value = opt.leftButtonText || '取消'
        leftButton.type = 'button'
        leftButton.style.cssText = btnStyle 
            + 'border-right:1px solid #d9d9d9;'
            + 'font-size:' + (opt.leftButtonTextSize || opt.buttonTextSize || '14px') + ';'
            + 'color:' + (opt.leftButtonTextColor || '#323232') + ';'
        
        var rightButton = document.createElement('input')
        rightButton.id = 'yconfirm-right-btn'
        rightButton.type = 'button'
        rightButton.value = opt.rightButtonText || '确定'
        rightButton.style.cssText = btnStyle
            + 'font-size:' + (opt.rightButtonTextSize || opt.buttonTextSize || '14px') + ';'
            + 'color:' + (opt.rightButtonTextColor || '#30b2fb') + ';'
        
        //按钮组装
        confirmBtnWrap.appendChild(leftButton)
        confirmBtnWrap.appendChild(rightButton)
        //提示文字组装
        confirmTextBlock.appendChild(confirmTextContent)
        //确认框可视区域
        confirmBlock.appendChild(confirmTextBlock)
        confirmBlock.appendChild(confirmBtnWrap)
        //整个提示框
        confirmWrap.appendChild(confirmBlock)
        //加入页面
        document.body.appendChild(confirmWrap)

        return {
            confirmWrap: confirmWrap,
            leftButton: leftButton,
            rightButton: rightButton
        }
    }

    //注册一次性事件
    var addEventOnce = function(dom, type, handler) {
        if(dom.addEventListener) {
            dom.addEventListener(type, handler.__wrapper = function(e) {
                return handler.call(dom, e)
            }, false)
            return {
                removeEvent: function() {
                    dom.removeEventListener(type, handler.__wrapper, false)
                }
            }
        } else if(dom.attachEvent) {
            dom.attachEvent('on' + type, handler.__wrapper = function(e) {
                return handler.call(dom, e)
            })
            return {
                removeEvent: function() {
                    context.detachEvent('on' + type, handler.__wrapper);
                }
            }
        }
    }
    //入口函数
    var YC = function(opt, cb) {
        var confirmWrap = document.getElementById('yh5confirm-wrap')
        var rightButton = ''
        var leftButton = ''
        if(!confirmWrap) { //第一次调用，未生成 confirm DOM
            var dom = genConfirmDom(opt)
            confirmWrap = dom.confirmWrap
            rightButton = dom.rightButton
            leftButton = dom.leftButton
        } else { //第一次调用，已生成 confirm DOM
            rightButton = document.getElementById('yconfirm-right-btn')
            leftButton = document.getElementById('yconfirm-left-btn')

            var confirmTextContent = document.getElementById('yconfirm-content')
            opt.confirmText && (confirmTextContent.innerHTML = opt.confirmText)
            opt.confirmTextColor && (confirmTextContent.style.color = opt.confirmTextColor)
            opt.confirmTextSize && (confirmTextContent.style.fontSize = opt.confirmTextSize)
            
            opt.leftButtonText && (leftButton.value = opt.leftButtonText)
            opt.leftButtonTextColor && (leftButton.style.color = opt.leftButtonTextColor)
            opt.leftButtonTextSize && (leftButton.style.fontSize = opt.leftButtonTextSize)
            
            opt.rightButtonText && (rightButton.value = opt.rightButtonText)
            opt.rightButtonTextColor && (rightButton.style.color = opt.rightButtonTextColor)
            opt.rightButtonTextSize && (rightButton.style.fontSize = opt.rightButtonTextSize)
        }
        //右侧按钮事件
        var rightFoo = addEventOnce(rightButton, 'click', function() {
            confirmWrap.style.display = 'none'
            cb(true)
            rightFoo.removeEvent()  //remove rigisted event
            leftFoo.removeEvent()
        })
        //左侧按钮事件
        var leftFoo = addEventOnce(leftButton, 'click', function() {
            confirmWrap.style.display = 'none'
            cb(false)
            leftFoo.removeEvent() //remove rigisted event
            rightFoo.removeEvent()
        })
    }

    return YC
}())

//如果采用模块化打包引入的时候加上这句
//module.exports = Yh5Confirm