/**
 * author: feifeiyu
 * version: 1.0
 * ylazyload for img lazyload
 * @param container //for init, visible area dom, type: string or DOM object, default document
 * @param cb //for init, callback, can be null 
 * @param imgs  //for appandImgs method, imgs list to lazyload, type: string or img DOM object list, can be nul
 * Ylazyload blog: https://feifeiyum.github.io//2017/05/13/front-ylazyload/
 */

var Ylazyload = (function() {
    //初始化组件
    var YLL = function(container, cb) {
        //获取可视区域 DOM object
        if(typeof container === 'string') {
            this.container = document.getElementById(container)
        } else if(container && container.constructor.toString().indexof('Element()') > -1) {
            this.container = container
        } else {
            this.container =  document
        }
        //暂存待加载真实地址的 img 元素对象
        this.imgList = []
        this.tid = 0
        cb && (this.cb = cb)
        this.getVisibleArea()
        this._refreshEvt()
    }
    //获取可视区域的坐标
    YLL.prototype.getVisibleArea = function() {
        try {
            this.visibleArea = this.container.getBoundingClientRect()
        } catch(err) {
            //如果 container 是 document 对象，直接取屏幕宽高
            this.visibleArea = {
                top: 0,
                left: 0,
                bottom: window.screen.availHeight,
                right: window.screen.availWidth
            }
        }
    }
    //为可视容器对象添加 scroll 事件
    YLL.prototype._refreshEvt = function() {
        var self = this
        if(self.container.addEventListener) {
            self.container.addEventListener('scroll', function() {
                clearTimeout(self.tid)
                //页面滚动时 不断去检测图片列表中进入可视区域的图片
                self.tid = setTimeout(self.isVisible.call(self), 300)
            })
            window.addEventListener('resize', function() {
                clearTimeout(self.tid)
                self.tid = setTimeout(function() {
                    self.getVisibleArea.call(self)
                    self.isVisible.call(self)
                })
            })
        } else if(self.container.attachEvent) {
            self.container.attachEvent('onscoll', function() {
                clearTimeout(self.tid)
                self.tid = setTimeout(self.isVisible.call(self), 300)
            })
            window.attachEvent('onresize', function() {
                clearTimeout(self.tid)
                self.tid = setTimeout(function() {
                    self.getVisibleArea.call(self)
                    self.isVisible.call(self)
                })
            })
        }
    }
    //添加需要懒加载的图片
    YLL.prototype.appendImgs = function(imgs) {
        var self = this
        if(typeof imgs === 'string') {
            imgs = document.querySelectorAll('.' + imgs)
        } else {
            imgs = document.querySelectorAll('img[ylazyload-src]')
        }
        imgs.forEach(function(item) {
            self.imgList.push(item)
        })
        this.isVisible()
    }
    //检查图片列表中是否进入可视区域
    YLL.prototype.isVisible = function() {
        var self = this
        var removeImg = []
        var listLen = self.imgList.length
        
        for(var i = 0; i < listLen; i++) { 
            var item = self.imgList[i]
            var itemCoord = item.getBoundingClientRect()
            //对比坐标判断是否进入进入可视区域
            if(itemCoord.top > self.visibleArea.bottom) {
                continue
            } else if(itemCoord.bottom < self.visibleArea.top) {
                continue
            } else if(itemCoord.left > self.visibleArea.right) {
                continue
            } else if(itemCoord.right < self.visibleArea.left) {
                continue
            } else {
                //如果进入可视区域，则替换去真实图片链接
                self._activeImg(item)
                //如果图片f已经替换了真实链接，踢出遍历列表
                removeImg.push(item)
            }
        }
        listLen = removeImg.length
        for(var i = 0; i < listLen; i++) {
            var index = self.imgList.indexOf(removeImg[i])
            self.imgList.splice(index, 1)
        }
    }
    //从属性 ylazyload-src 取出真实图片地址， 替换默认图片地址
    YLL.prototype._activeImg = function(imgDom) {
        var self = this
        var realSrc = imgDom.getAttribute('ylazyload-src')
        if(realSrc) {
            imgDom.setAttribute('src', realSrc)
            //删除图片属性 ylazyload-src
            imgDom.removeAttribute('ylazyload-src')
            //回调
            self.cb && self.cb(imgDom, realSrc)
        }
    }
    return YLL
}())

//如果采用模块化打包引入的时候加上这句
// module.exports = Ylazyload