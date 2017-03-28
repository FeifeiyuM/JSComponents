/**
 * author: feifeiyu
 * verion: 2.0
 * @param target // list container DOM id， not null
 * @param refresh  // enable or disable page refresh, type: boolean, default: true
 * @param url // request api address, type: url string,
 * @param headers //http request headers, type: object
 * @param param //http request query(parameters), type: object
 * @param height //list container height, type: number, default: window.screen.height
 * @param loadImmedate  // whether send request on page init or not, type: boolean, default: true
 * @param preload  // enable or disable page list preload, default: true
 × @param cb // callback type: function
 * parameters for reset function
 * @param url // reset request api address, type: url string  
 * @param param // reset request query, type: object
 * @param cb // callback type: function
 * Yscroll is a page split component for h5
 * Yscroll blog: https://feifeiyum.github.io/2016/09/26/front-yscroll-for-h5/
 */

// const reqwest = require('reqwest')

var Yscroll = (function() {
    var YS = function(opt, cb) {
        if(!opt.target) {
            throw '[error]: Yscroll - target id can\'t be null'
        }
        if(typeof opt.target !== 'string') {
            throw '[error]: Yscroll - type of target id is string'
        }
        if(opt.url !== undefined && typeof opt.url !== 'string') {
            throw '[error]: Yscroll - type of request url is string '
        }
        if(opt.headers !== undefined && typeof opt.headers !== 'object') {
            throw '[error]: Yscroll - type of headers (http headers) is object '
        }
        if(opt.refresh !== undefined && typeof opt.refresh !== 'boolean') {
            throw '[error]: Yscroll - type of refresh is boolean'
        }
        if(opt.loadImmediate !== undefined && typeof opt.loadImmediate !== 'boolean') {
            throw '[error]: Yscroll - type of loadImmediate is boolean'
        }
        if(opt.preload !== undefined && typeof opt.preload !== 'boolean') {
            throw '[error]: Yscroll - type of preload is boolean'
        }
        if(opt.height !== undefined && typeof opt.height !== 'number') {
            throw '[error]: Yscroll - type of height is number'
        }
        if(opt.param !== undefined && typeof opt.param != 'object') {
            throw '[error]: Yscroll - type of param is object'
        }

        var self = this
        self.refresh = opt.refresh !== undefined ? opt.refresh : true //是否使能下拉刷新
        opt.headers && (self.headers = opt.headers) //http 请求头部
        self.height = opt.height || window.screen.height //列表高度
        opt.url && (self.next = opt.url)  //请求地址
        self.preload = opt.preload !== undefined ? opt.preload : true //是否使能预加载
        self.loadEnable = opt.url !== undefined
        self.cb = cb //回调
        //是否实例化后就加载数据
        var loadImmediate = opt.loadImmediate !== undefined ? opt.loadImmediate : true

        if(opt.param) {
            self.next = self.assembleQuery(self.next, opt.param)
        }

        //生成所需要dom
        self.genDom(opt.target)
        //注册事件
        self.touchEvt()
        //加载数据
        loadImmediate && self.fetchData()
    }

    YS.prototype.genDom = function(target) {
        var self = this
        //Yscroll Wrap
        self.ysWrap = document.createElement('div')
        self.ysWrap.id = 'yscroll-wrapper'
        self.ysWrap.style.cssText = 'position:absolute;'
            + 'width:100%;'
            + 'overflow-x:hidden;'
            + 'overflow-y:scroll;'
            + '-webkit-overflow-scrolling:touch;'
            + 'height:' + self.height + 'px;'
        
        //加载更多图标
        self.loadMoreNode = document.createElement('p')
        self.loadMoreNode.id = 'yscroll-more'
        self.loadMoreNode.style.cssText = 'display:none;'
            + 'margin:0;'
            + 'bottom:-28px;'
            + 'text-align:center;'
            + 'height:28px;'
            + 'line-height:28px;'
            + 'font-size:12px;'
            + 'color:#323232;'
        self.loadMoreNode.innerHTML = '上拉加载更多'

        //下拉刷新图标
        self.refreshNode = document.createElement('p')
        self.refreshNode.id = 'yscroll-more'
        self.refreshNode.style.cssText = 'display:none;'
            + 'margin:0;'
            + 'text-align:center;'
            + 'height:28px;'
            + 'line-height:28px;'
            + 'font-size:12px;'
            + 'color:#323232;'
        self.refreshNode.innerHTML = '下拉刷新'

        var targetNode = document.getElementById(target) 
        var tarParent = targetNode.parentNode
        tarParent.style.position = 'relative'

        if(!targetNode) {
            throw '[error]: Yscroll - can not find list target DOM'
        }
        self.ysWrap.appendChild(self.refreshNode)
        self.ysWrap.appendChild(targetNode)
        self.ysWrap.appendChild(self.loadMoreNode)
        tarParent.appendChild(self.ysWrap)
    }

    YS.prototype.fetchData = function() {
        var self = this
        console.log('next', self.next)
        if(self.next === 'refresh') {
            self.loadEnable = true
            self.cb(null, 'refresh')
        } else {
            self.loadMoreNode.innerHTML = '加载中 . . .'
            self.refreshNode.innerHTML = '加载中 . . .'
            reqwest({
                url: self.next,
                method: 'GET',
                headers: self.headers,
                crossOrigin: true
            }).then(function(resp) {
                if(resp.next) {
                    self.next = resp.next
                    self.loadMoreNode.style.display = 'none'
                    self.loadMoreNode.innerHTML = '上拉加载更多'
                } else {
                    self.loadEnable = false
                    self.loadMoreNode.style.display = 'block'
                    self.loadMoreNode.innerHTML = '没有更多了'
                }
                self.refreshNode.style.display = 'none'
                self.refreshNode.innerHTML = '下拉刷新'
                
                self.cb(null, resp)
            })
        }
    }

    YS.prototype.touchEvt = function() {
        var self = this
        var startY = 0 //滑动起点
        var offsetY = 0 //拉动距离

        //touch事件处理
        var touch = function(e) {
            // e.preventDefault()  //加了 scroll 事件没了
            var evt = e || window.event
            var offsetTop = self.ysWrap.scrollHeight - self.height  //相对与顶部最大偏移距离
            var scrollTop = self.ysWrap.scrollTop
            var touch = e.touches[0]
           
            switch(evt.type) {
                case 'touchstart':
                    startY = touch.pageY
                    break
                case 'touchmove':
                   if(touch.pageY < 200) { //avoid scroll leakage
                        evt.preventDefault
                    } else {
                        offsetY = touch.pageY - startY
                        if(self.refresh && scrollTop === 0 && offsetY > 0) {
                            //在顶部，下拉
                            evt.preventDefault()
                            self.ysWrap.style.top = offsetY + 'px'
                            self.refreshNode.style.display = 'block'
                            self.loadMoreNode.style.display = 'none'
                        } else if((offsetTop - scrollTop) < 3 && offsetTop > 0 && offsetY < 0) {
                            //在底部， 上拉
                            //页面存在折叠 即 offsetTop > 0
                            evt.preventDefault()
                            self.ysWrap.style.top = offsetY + 'px'
                            self.loadMoreNode.style.display = 'block'
                            self.refreshNode.style.display = 'none'
                        }
                    }
                    break
                case 'touchend':
                    self.ysWrap.style.top = '0px'
                    if(!self.loadEnable && offsetY < 0) {
                        //不加载更多，下拉时，把页面拉到底部
                        if((offsetTop - scrollTop) < 100) {
                            document.body.scrollTop = 10000  //把body移到底部
                            offsetTop && (self.ysWrap.scrollTop = self.ysWrap.scrollHeight)
                        } 
                    } else if(self.loadEnable && offsetY < 0) {
                        //下滑
                        if((offsetTop - scrollTop) < 100) {
                            document.body.scrollTop = 10000  //把body移到底部
                        }
                        
                        if(self.preload && (offsetTop - scrollTop) / self.height < 0.3) {
                            //提前加载， 在页面滚到到底部之前加载
                            self.fetchData() //请求接口
                        } else if((offsetTop - scrollTop) < 3 && offsetY < -100) {
                            //下拉加载 在页面滚到到底部加载
                            self.fetchData() //请求接口
                        }
                    } else if(self.refresh && offsetY > 0) {
                        //上滑
                        document.body.scrollTop = 0  //把body移到顶部
                        if(scrollTop == 0) {
                            if (offsetY > 120) {
                                let urlTmp = self.next
                                self.next = 'refresh'
                                self.fetchData() //请求清空
                                self.next = urlTmp.replace(/&?page=\d+/, '')
                                self.fetchData()  //重新加载数据
                            } 
                        }
                    }
                    break
                case 'touchcancel': 
                    self.ysWrap.style.top = '0px'
                    if(!self.loadEnable && offsetY < 0) {
                        //不加载更多，下拉时，把页面拉到底部
                        if((offsetTop - scrollTop) < 100) {
                            document.body.scrollTop = 10000  //把body移到底部
                            offsetTop && (self.ysWrap.scrollTop = self.ysWrap.scrollHeight)
                        } 
                    } else if(self.loadEnable && offsetY < 0) {
                        //下滑
                        if((offsetTop - scrollTop) < 100) {
                            document.body.scrollTop = 10000  //把body移到底部
                        }
                        
                        if(self.preload && (offsetTop - scrollTop) / self.height < 0.3) {
                            //提前加载， 在页面滚到到底部之前加载
                            self.fetchData() //请求接口
                        } else if((offsetTop - scrollTop) < 3 && offsetY < -100) {
                            //下拉加载 在页面滚到到底部加载
                            self.fetchData() //请求接口
                        }
                    } else if(self.refresh && offsetY > 0) {
                        //上滑
                        document.body.scrollTop = 0  //把body移到顶部
                        if(scrollTop == 0) {
                            if (offsetY > 120) {
                                let urlTmp = self.next
                                self.next = 'refresh'
                                self.fetchData() //请求清空
                                self.next = urlTmp.replace(/&?page=\d+/, '')
                                self.fetchData()  //重新加载数据
                            } 
                        }
                    }
                    break
                default:
                    break
            }
        }

        self.ysWrap.addEventListener('touchstart', touch, false)
        self.ysWrap.addEventListener('touchmove', touch, false)
        self.ysWrap.addEventListener('touchend', touch, false)
        self.ysWrap.addEventListener('touchcancel', touch, false)
    }

    YS.prototype.reset = function(url, param, cb) {
        console.log('in reset')
        var self = this
        if(url !== undefined && typeof url !== 'string') {
            throw '[error] Yscroll - type of url in Yscroll.reset is string'
        }
        if(param !== undefined && typeof param !== 'object') {
            throw '[error] Yscroll - type of param in Yscroll.reset is object'
        }

        url && (self.next = url)
        if(param) {
            self.next = self.assembleQuery(self.next, param)
        }
        cb && (self.cb = cb)
        
        //请求数据
        self.fetchData()
    }

    //组装参数
    YS.prototype.assembleQuery = function(url, param) {
        var query = ''
        for(var key in param) {
            query += '&' + key + '=' + param[key]
        }
        if(/\?\w+/.test(url)) {
            url += query
        } else {
            url += '?' + query.slice(1)
        }
        return url
    }

    return YS
}())

//如果采用模块化打包引入的时候加上这句
// module.exports = Yscroll