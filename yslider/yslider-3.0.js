/**
 * author: feifeiyu
 * version: 3.4
 * Yslider is a simple images slider for h5
 * @param target //slider container id
 * @param interval  // images change interval, s, default 3s
 * @param imgArray // images list, include properties: redirect, type, url, detail
 * @param showCircle //show circle nav, dafault true
 * @param circleColor: //circle background-color
 * yslider blog: https://feifeiyum.github.io/2016/10/30/yslider/
 */

var Yslider = (function() {

    var imgsNode = ''  //图片wrap
    var circlesNode = '' //圆点 dom
    var conWidth = '' // 图片宽度
    var circleColor = '' //圆点颜色
    var interval = ''  //间隔时间
    var autoPlay = true //是否自动轮播
    var intervalFlag = null //setInterval 值
    var currentIndex = 0 //当前页面编号
    var imgLength = ''
    var videoIds = []  //视频 video 标签 id
    var conHeight = ''
    var isPlaying = false //视频是否正在播放

    var ysGenDom = function(opt) {
        var container = document.getElementById(opt.target)
        if(!container) {
            throw '[error]: Yslider - can not find slider container DOM'
        }

        conWidth = container.clientWidth //slider width
        conHeight = container.offsetHeight //slider height
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
            +  '<ul id="yslider-imglist" class="yslider-imglist" style="position: relative;margin: 0; padding: 0; height: 100%; transition: all 0.5s; width: ' +( conWidth * imgLength) + 'px;clear: both;">'
        var sliderItems = ''
        for(var i = 0; i < imgLength; i++) {
            var index = i
            if(opt.imgArray[index].type === 'video') {
                if(opt.enable) {
                    var tagId = 'yvideo-' + i 
                    sliderItems += '<li class="yvideo-item" style="float: left; height: 100%; width: ' + conWidth + 'px;">'
                            + '<video id="' + tagId + '" class="yvideo-play video-js" controls preload="auto" width="' + conWidth + '" height="' + conHeight + '" poster="' + opt.imgArray[index].url + '" data-setup="{}">'
                            + '<source src="' + opt.imgArray[index].redirect + '"></source>'
                            + '</video>'
                        + '</li>'
                    videoIds.push(tagId)
                } else {
                    sliderItems += '<li style="float:left; height: 100%; width: ' + conWidth + 'px;">'
                   + '<a href="javascript:void(0);">'
                   + '<img\ v-url="' + opt.imgArray[index].redirect + '" src="' + opt.imgArray[index].url + '"\ alt="' + opt.imgArray[index].detail + '"\ style="width: 100%;">'
                   + '<button class="video-play" v-url="' + opt.imgArray[index].redirect + '" style="position:absolute; top:35%; left:' + conWidth*(i+0.4)+ 'px; border: 2px solid #fff; border-radius: 50%; background: rgba(43, 51, 63, 0.6); height: 60px; width: 60px; "><div v-url="' + opt.imgArray[index].redirect + '" style="position:relative;left:16px;width:0;height:0;transform: rotate(45deg);border:8px solid;border-color: #fff #fff transparent transparent;"></div></button>'
                   + '</a></li>'
                }
            } else {
                sliderItems += '<li style="float: left; height: 100%; width: ' + conWidth + 'px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack: center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;">'
                    + (opt.imgArray[index].redirect ? '<a href="' + opt.imgArray[index].redirect + '">' : '<a>')
                    + '<img src="' + opt.imgArray[index].url + '" alt="' + opt.imgArray[index].detail + '" style="width: 100%;height: auto;">'
                    + '</a></li>'
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
    var ysInit = function(cColor, showCircle, autoplay, inval) {
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
        autoPlay = autoplay
        interval = (inval * 1000) || 3000
    }
    //图片切换函数
    var ysChangeImg = function(index) {
        if(imgLength === 1) {
            return
        }
        if(index == 'next') {
            currentIndex++
        } else if(index == 'prev') {
            currentIndex--
        } else {
            currentIndex = index
        }
        currentIndex = currentIndex < 0 ? (imgLength - 1) : (currentIndex % imgLength)
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
    var ysPlayVideo = function(enable, cb) {
       //注册 video 事件
        for(var i = 0; i < videoIds.length; i ++) {
            videojs(videoIds[i], {}, function onPlayerReady() {
                var vsrc = this.children()[0].currentSrc
                this.on('play', function() {
                    clearInterval(intervalFlag)
                    isPlaying = true
                    cb({status: 'play', src: vsrc})
                })
                this.on('pause', function() {
                    this.exitFullscreen()
                    cb({status: 'pause', src: vsrc})
                })
                this.on('ended', function() {
                    this.exitFullscreen()
                    isPlaying = false
                    ysAutoPlay()
                    cb({status: 'ended', src: vsrc})
                })
            })
        }
    }
    //自动播放函数
    var ysAutoPlay = function() {
        autoPlay && (intervalFlag = setInterval(function() { ysChangeImg('next')}, interval))
    }
    //手动播放函数
    var ysManualPlay = function(cb) {
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
                    if(imgLength > 1) {
                        ySlideroffsetX = touch.pageX - ySliderStartX
                        imgsNode.style.marginLeft = '-' + (currentIndex * conWidth - ySlideroffsetX) + 'px'
                    }
                    break
                case 'touchend':
                    e.preventDefault()
                    if(ySlideroffsetX < 3 && ySlideroffsetX > -3) { //点击图片
                        var vsrc = e.target.getAttribute('v-url')
                        if(vsrc) {
                            cb({status: 'play', src: vsrc})
                        } else if(e.target.tagName === "IMG") {
                            imgsNode.childNodes[currentIndex].childNodes[0].click()
                            cb({status: 'showimg', src: e.target.src})
                        } else if(e.target.tagName === 'VIDEO' || e.target.tagName === "DIV" || e.target.tagName === 'BUTTON') {
                            return false
                        } 
                    } else if(ySlideroffsetX < -50) {
                        ysChangeImg('next') //左滑下一页
                    } else if(ySlideroffsetX > 50) {
                        ysChangeImg('prev') //右划上一页
                    } else { //滑动距离小，恢复
                        imgsNode.style.marginLeft = '-' + (currentIndex * conWidth) + 'px'
                    }
                    ySlideroffsetX = 0  //清空偏移
                    ySliderStartX = 0 //清空起始坐标
                    !isPlaying && ysAutoPlay()  //恢复自动轮播
                    break
                case 'touchcancel':
                    e.preventDefault()
                    if(ySlideroffsetX < 3 && ySlideroffsetX > -3) { //点击图片
                        var vsrc = e.target.getAttribute('v-url')
                        if(vsrc) {
                            cb({status: 'play', src: vsrc})
                        } else if(e.target.tagName === "IMG") {
                            imgsNode.childNodes[currentIndex].childNodes[0].click()
                        } else if(e.target.tagName === 'VIDEO' || e.target.tagName === "DIV" || e.target.tagName === 'BUTTON') {
                            return false
                        }
                    } else if(ySlideroffsetX < -50) {
                        ysChangeImg('next') //左滑下一页
                    } else if(ySlideroffsetX > 50) {
                        ysChangeImg('prev') //右划上一页
                    } else { //滑动距离小，恢复
                        imgsNode.style.marginLeft = '-' + (currentIndex * conWidth) + 'px'
                    }
                    ySlideroffsetX = 0  //清空偏移
                    ySliderStartX = 0 //清空起始坐标
                   !isPlaying && ysAutoPlay()  //恢复自动轮播
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


    var YS = function(opt, cb) {
        if(!opt.target) {
            throw '[error]: Yslider - slider container DOM id target can not be null'
        }
        if(opt.autoplay !== undefined && typeof opt.autoplay !== 'boolean') {
            throw '[error]: Yslider - type of autoplay is boolean'
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
        if(opt.enable !== undefined && typeof opt.enable !== 'boolean') {
            throw '[error]: Yslider - type of enable is boolean'
        }
        //生成 slider DOM
        ysGenDom(opt)
        //初始化参数
        ysInit(opt.circleColor, opt.showCircle, opt.autoplay, opt.interval)
        //自动播放
        ysAutoPlay()
        //手动播放注册
        ysManualPlay(cb)
        //播放器事件注册
        if(videoIds.length > 0) {
            ysPlayVideo(opt.enable !== undefined ? opt.enable : true, cb)
        }
    }
    return YS
}())
//如果采用模块化打包的时候加上这句
// module.exports = Yslider