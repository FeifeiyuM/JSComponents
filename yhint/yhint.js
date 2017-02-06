var Yhint = (function() {
    var YH = function(opt) {

        if(opt.target === undefined || typeof opt.target !== 'string') {
            throw 'yhint: type of target is dom id and not null'
        }
        if(opt.successBgColor !== undefined && typeof opt.successBgColor !== 'string') {
            throw 'yhint: type of successBgColor is string'
        }
        if(opt.successFontColor !== undefined && typeof opt.successFontColor !== 'string') {
            throw 'yhint: type of successFontColor is string'
        }
        if(opt.failedBgColor !== undefined && typeof opt.failedBgColor !== 'string') {
            throw 'yhint: type of failedBgColor is string'
        }
        if(opt.failedFontColor !==undefined && typeof opt.failedFontColor !== 'string') {
            throw 'yhint: type of failedFontColor is string'
        }
        if(opt.yhintHeight !== undefined && typeof opt.height !== 'number') {
            throw 'yhint: type of height is number'
        }
        if(opt.yhintWidth !== undefined && typeof opt.width !== 'number') {
            throw 'yhint: type of width is number'
        }
        if(opt.existTime !== undefined && typeof opt.existTime !== 'number') {
            throw 'yhint: type of existTime is number'
        }

        this.successBgColor = opt.successBgColor || '#b3e4d1'
        this.successFontColor = opt.successFontColor || '#04a768'
        this.failedBgColor = opt.failedBgColor || '#ff4546'
        this.failedFontColor = opt.failedFontColor || '#fff'
        this.yhintHeight = opt.yhintHeight || 30
        this.yhintWidth = opt.yhintWidth 
        this.existTime = opt.existTime || 3000

        this.yhintWrap = document.createElement('div')
        this.yhintWrap.className = 'yhint-wrap'
        document.getElementById(opt.target).appendChild(this.yhintWrap)

        this.domSuccess = document.createElement('p')
        this.domSuccess.style.cssText = this.styleSheet('success')

        this.domFailed = document.createElement('p')
        this.domFailed.style.cssText = this.styleSheet('failed')
    }

    YH.prototype.styleSheet = function(type) {

        var style = 'position:absolute;'
                + 'top:-' + this.yhintHeight + 'px;'
                + 'height:' + this.yhintHeight + 'px;'
                + 'line-height:' + this.yhintHeight + 'px;'
                + 'text-align: center;'
                + 'transition: top .5s ease-in-out;'
                + '-webkit-transition: top .5s ease-in-out;'
                + '-moz-transition: top .5s ease-in-out;'
                + '-o-transition: top .5s ease-in-out;'
        if(this.yhintWidth) {
            style += 'width:' + this.yhintWidth + 'px;'
        } else {
            style += 'width:100%;'
        }
        if(type === 'success') {
            style += 'background:' + this.successBgColor + ';'
                + 'color:' + this.successFontColor + ';'
        } else if(type === 'failed') {
            style += 'background:' + this.failedBgColor + ';'
                + 'color:' + this.failedFontColor + ';'
        }
        return style
    }

    Yhint.prototype.success = function(words) {
        var newSuccDom = this.domSuccess.cloneNode()
        newSuccDom.innerHTML = words
        this.yhintWrap.appendChild(newSuccDom)
        var timeout1 = setTimeout(function() {
            newSuccDom.style.top = '0px'
            clearTimeout(timeout1)
        }, 50)
        var timeout2 = setTimeout(function() {
            newSuccDom.style.top = '-' + newSuccDom.style.height
            clearTimeout(timeout2)
        }, this.existTime)
        var timeout3 = setTimeout(function() {
            newSuccDom.parentNode.removeChild(newSuccDom)
            clearTimeout(timeout3)
        }, this.existTime * 2)
    }

    YH.prototype.closeFailed = function() {
        var parentDom = this.parentNode
        parentDom.style.top = '-' + parentDom.style.height
        var timeout = setTimeout(function() {
            parentDom.parentNode.removeChild(parentDom)
            clearTimeout(timeout)
        }, 10000)
    }

    YH.prototype.failed = function(words) {
        var self = this
        var newFailDom = self.domFailed.cloneNode()
        newFailDom.innerHTML = words + '<span style="float:right;font-size:20px;margin-right:10px;cursor: pointer;">X</span>'
        self.yhintWrap.appendChild(newFailDom)

        var timeout1 = setTimeout(function() {
            newFailDom.style.top = '0px'
            clearTimeout(timeout1)
        }, 50)

        newFailDom.lastChild.addEventListener('click', this.closeFailed, false)
    }
    
    return YH
}())
//如果采用模块化打包引入的时候加上这句
// module.exports = Yhint