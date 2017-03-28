/**
 * author: feifeiyu
 * version: 2.3
 * Yslider is a simple images slider for h5
 * @param target //slider container id
 * @param interval  // images change interval, s, default 3s
 * @param imgArray // images list, include properties: redirect, type, url, detail
 * @param showCircle //show circle nav, dafault true
 * @param circleColor: //circle background-color
 * yslider blog: https://feifeiyum.github.io/2016/10/30/front-yslider/
 */

var Yslider = (function() {

    var imgsNode = ''  //图片wrap
    var circlesNode = '' //圆点 dom
    var conWidth = '' // 图片宽度
    var circleColor = '' //圆点颜色
    var interval = ''  //间隔时间
    var intervalFlag = null //setInterval 值
    var currentIndex = 0 //当前页面编号
    var imgLength = ''

    var ysGenDom = function(opt) {
        var container = document.getElementById(opt.target)
        if(!container) {
            throw '[error]: Yslider - can not find slider container DOM'
        }

        conWidth = container.clientWidth //slider width
        imgLength = opt.imgArray.length 

        //检查 imgArray 有效性
        for(var i = 0; i < imgLength; i++) {
            if(!opt.imgArray[i].url) {
                opt.imgArray.splice(i, 1)
                imgLength -= 1
                i -= 1
            }
        }
        
        //生成slider dom 字符串
        var sliderNode = '<div id="yslider-wrap" class="yslider-wrap"'
            + 'style="position: relative; width: 100%; height: 100%; overflow: hidden;">'
            +  '<ul id="yslider-imglist" class="yslider-imglist" style="position: relative;margin: 0; padding: 0; height: 100%; transition: all 0.5s; width: ' +( conWidth * (imgLength * 2) ) + 'px;">'
        var sliderItems = ''
        for(var i = 0; i < 2 * imgLength; i++) {
            var index = i % imgLength
            if(opt.imgArray[index].type === 'video') {
                sliderItems += '<li style="display: inline-block; height: 100%; width: ' + conWidth + 'px;">'
                   + '<img\ v-url="' + opt.imgArray[index].redirect + '" src="' + opt.imgArray[index].url + '"\ alt="' + opt.imgArray[index].detail + '"\ style="width: 100%;">'
                   + '<button class="video-play" v-url="' + opt.imgArray[index].redirect + '" style="position:absolute; top:35%; left:' + conWidth*(i+0.4)+ 'px; border: 2px solid #fff; border-radius: 50%; background: rgba(43, 51, 63, 0.6); height: 60px; width: 60px; "><div v-url="' + opt.imgArray[index].redirect + '" style="position:relative;left:16px;width:0;height:0;transform: rotate(45deg);border:8px solid;border-color: #fff #fff transparent transparent;"></div></button>'
                   + '</li>'
            } else {
                sliderItems += '<li style="display: inline-block; height: 100%; width: ' + conWidth + 'px;">'
                    + (opt.imgArray[index].redirect ? '<a\ href="' + opt.imgArray[index].redirect + '">' : '<a>')
                    + '<img\ src="' + opt.imgArray[index].url + '"\ alt="' + opt.imgArray[index].detail + '"\ style="width: 100%;">'
                    + '</a></li>'
            }
            if(imgLength === 1) {
                break
            }
        }
        sliderNode += sliderItems

        if(opt.showCircle && imgLength > 1) {
            sliderNode += '</ul><ul class="ysclider-circles" style="position: relative; bottom: 30px; margin: auto; width:'+ (18 * imgLength) +'px;">'
            for(var i=0; i<imgLength; i++) {
                sliderNode += '<li style="margin-right: 5px; display: inline-block;">'
                    + '<span class="ysclider-circle" style="display: block; width: 10px; height: 10px; border: 1px solid #ddd; border-radius: 50%; background: transparent;"></span></li>'
            }
        }
        sliderNode += '</ul></div>'
        container.innerHTML = sliderNode
    }
    //初始化函数
    var ysInit = function(cColor, showCircle, inval) {
        imgsNode = document.getElementById('yslider-imglist')
        if(showCircle) {
            circlesNode = document.getElementsByClassName('ysclider-circle')
            circleColor = cColor || '#00F5FF'
            //初始化，第一个园点加上样式
            if(circlesNode.length > 0) {
                circlesNode[0].style.backgroundColor = circleColor
                circlesNode[0].style.borderColor = circleColor
            }
        }
        interval = (inval * 1000) || 3000
    }
    //图片切换函数
    var ysChangeImg = function(index) {
        if(imgLength === 1) {
            return
        }
        if(index == 'next') {
			currentIndex ++
		} else if(index == 'prev') {
			currentIndex --
		} else {
			currentIndex = index
		}
        currentIndex = currentIndex < 0 ? (imgLength * 2 - 1) : (currentIndex % (imgLength * 2))
        var circleIndex = currentIndex % imgLength
        
        //移动图片
        imgsNode.style.marginLeft = '-' + (currentIndex * conWidth) + 'px'
        //圆点
        if(circlesNode) {
            for(var i = 0; i < imgLength; i++) {
                if(circleIndex === i) {
                    circlesNode[i].style.backgroundColor = circleColor
                    circlesNode[i].style.borderColor = circleColor
                } else {
                    circlesNode[i].style.backgroundColor = ''
                    circlesNode[i].style.borderColor = '#ddd'
                }
            }
        }
    }
    //视频播放
    var ysPlayVideo = function(vsrc) {
        var yslider = document.getElementById('yslider-wrap')
        var coverTag, closeTag, videoTag, vSource
        //播放器关闭
        var closeVideo = function() {
            //销毁播放器
            yslider.removeChild(coverTag)
        }
        //生成播放器元素
        var genVTage = function() {
            coverTag = document.createElement('div')
            coverTag.id = 'yslider-cover'
            coverTag.style.cssText = 'position: fixed;'
                + 'top:0;left:0; width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:2000;'
            closeTag = document.createElement('div')
            closeTag.id = 'yslider-closev'
            closeTag.style.cssText = 'position:absolute;'
                + 'margin: 5px;'
                + 'top:0;right:0;height:30px;width:30px;border-radius:50%;background:#fff;color:#000;'
                + 'font-size:20px;text-align:center;font-family:sans-serif;'
            closeTag.innerHTML = 'X'
            videoTag = document.createElement('video')
            videoTag.id = 'yslider-video'
            videoTag.autoplay = 'true'
            videoTag.controls = 'true'
            videoTag.style.cssText = 'position: relative;'
                + 'top:25%;'
                + 'width:' + conWidth + 'px;height:auto;max-height:' + conWidth + 'px;'
            vSource = document.createElement('source') 
            vSource.src = vsrc
            vSource.type = 'video/mp4'
            videoTag.appendChild(vSource)
            coverTag.appendChild(closeTag)
            coverTag.appendChild(videoTag)
            videoTag.play()
            yslider.appendChild(coverTag)
        }
        //播放
        genVTage()
        closeTag.addEventListener('click', closeVideo, false)
        
    }
    //自动播放函数
    var ysAutoPlay = function() {
        intervalFlag = setInterval(function() { ysChangeImg('next')}, interval)
    }
    //手动播放函数
    var ysManualPlay = function() {
        var ySlideroffsetX = 0
        var ySliderStartX = 0

        var touchEvt = function(evt) {
            var e = evt || window.event
            var touch = e.touches[0]
            
            switch(e.type) {
                case 'touchstart':
                    e.preventDefault()
                    ySliderStartX = touch.pageX
                    clearInterval(intervalFlag)
                    break
                case 'touchmove': 
                    e.preventDefault()
                    ySlideroffsetX = touch.pageX - ySliderStartX
                    imgsNode.style.marginLeft = '-' + (currentIndex * conWidth - ySlideroffsetX) + 'px'
                    break
                case 'touchend':
                    e.preventDefault()
                    if(ySlideroffsetX < 3 && ySlideroffsetX > -3) { //点击图片
                        var vsrc = e.target.getAttribute('v-url')
                        if(vsrc) {
                            ysPlayVideo(vsrc)
                        } else {
                            imgsNode.childNodes[currentIndex].childNodes[0].click()
                        }
                    } else if(ySlideroffsetX < -150) {
                        ysChangeImg('next') //左滑下一页
                    } else if(ySlideroffsetX > 150) {
                        ysChangeImg('prev') //右划上一页
                    } else { //滑动距离小，恢复
                        imgsNode.style.marginLeft = '-' + (currentIndex * conWidth) + 'px'
                    }
                    ySlideroffsetX = 0  //清空偏移
                    ySliderStartX = 0 //清空起始坐标
                    ysAutoPlay()  //恢复自动轮播
                    break
                case 'touchcancel':
                    e.preventDefault()
                    if(ySlideroffsetX < 3 && ySlideroffsetX > -3) { //点击图片
                        var vsrc = e.target.getAttribute('v-url')
                        if(vsrc) {
                            ysPlayVideo(vsrc)
                        } else {
                            imgsNode.childNodes[currentIndex].childNodes[0].click()
                        }
                    } else if(ySlideroffsetX < -100) {
                        ysChangeImg('next') //左滑下一页
                    } else if(ySlideroffsetX > 100) {
                        ysChangeImg('prev') //右划上一页
                    } else { //滑动距离小，恢复
                        imgsNode.style.marginLeft = '-' + (currentIndex * conWidth) + 'px'
                    }
                    ySlideroffsetX = 0  //清空偏移
                    ySliderStartX = 0 //清空起始坐标
                    ysAutoPlay()  //恢复自动轮播
                    break
                default:
                    break
            }
        }
        imgsNode.addEventListener('touchstart', touchEvt, false)
        imgsNode.addEventListener('touchmove', touchEvt, false)
        imgsNode.addEventListener('touchend', touchEvt, false)
        imgsNode.addEventListener('touchcancel', touchEvt, false)
    }


    var YS = function(opt) {
        if(!opt.target) {
            throw '[error]: Yslider - slider container DOM id target can not be null'
        }
        if(opt.interval !== undefined && typeof opt.interval !== 'number') {
            throw '[error]: Yslider - type of images change interval is number'
        }
        if(opt.imgArray === undefined) {
            throw '[error]: Yslider - slider\'s imgArray (image list array) can not be null'
        }
        if(opt.imgArray.constructor.toString().indexOf('Array') === -1) {
            throw '[error]: Yslider - type of imgArray is array'
        }
        if(opt.showCircle !== undefined && typeof opt.showCircle !== 'boolean') {
            throw '[error]: Yslider - type of showCircle is boolean'
        }
        //生成 slider DOM
        ysGenDom(opt)
        //初始化参数
        ysInit(opt.circleColor, opt.showCircle, opt.interval)
        //自动播放
        ysAutoPlay()
        //手动播放注册
        ysManualPlay()
    }
    return YS
}())
//如果采用模块化打包的时候加上这句
// module.exports = Yslider