/**
 * author: feifeiyu
 * version: 1.3
 * Yverifycode is a verification code component
 * @param input //verification code input Dom id, not null 
 * @param container  //verification code image container Dom id, not null
 * @param reset //verification code reset Dom id 
 * @param length //verification code length, default 4
 * @param bgColor //verification code container background color, 
 * @param bgImg  //verification code container background image,
 * Yverifycode blog: https://feifeiyum.github.io/2017/01/04/verify-code/
*/

//定义Yverifycode 
var Yverifycode = (function() {
    var NewVC = function(opt) {
        //初始化值校验
        if(opt.input === undefined) {
            throw 'verification code input Dom target id can\'t be null'
        }
        if(opt.container === undefined) {
            throw 'verification code image Dom container target id can\'t be null'
        }
        if(opt.reset !== undefined && typeof opt.reset !== 'string') {
            throw 'type of verification code reset dom id is string '
        }
        if(opt.length !== undefined && typeof opt.length !== 'number') {
            throw 'type of verification code length is number'
        }
        if(opt.width !== undefined && typeof opt.width !== 'number') {
            throw 'type of verification code window width is number'
        }
        if(opt.bgColor !== undefined && !/^#([a-f0-9A-F]{3}|[a-f0-9A-F]{6})$/.test(opt.bgColor)) {
            throw 'type of verification code background color is hex'
        }
        if(opt.bgImg !== undefined && typeof opt.bgImg !== 'string') {
            throw 'type of verification code background image is url(string)'
        }
        
        this.input = document.getElementById(opt.input)
        opt.reset && (this.reset = opt.reset)
        this.container = opt.container
        this.length = opt.length || 4
        this.width = opt.width || 100
        opt.bgColor && (this.bgColor = opt.bgColor)
        opt.bgImg && (this.bgImg = opt.bgImg)
        this.code = ''

        //初始化
        this.init()
    }
    //初始化函数
    NewVC.prototype.init = function() {
        var self = this
        self.styleOption()
        
        self.genDom()
        self.drawCode()
        self.drawLines()

        if(self.reset) {
            document.getElementById(self.reset).addEventListener('click', function() { 
                self.refresh.call(self) 
            }, false)
        }
    }
    //随机数生成器
    NewVC.prototype.randInt = function(start, end) {
        !start && (start = 0)
        !end && (end = 10)
        var distance = end - start 
        var num = Math.random() * distance + start 
        return Math.floor(num)
    }
    //生成随机校验码
    NewVC.prototype.genRandStr = function() {
        var codeChars = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9,   
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',  
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
        ]
        
        for(var i = 0; i < this.length; i++) {
            this.code += (codeChars[this.randInt(0, codeChars.length)])
        }
    }
    //生成校验码图片框
    NewVC.prototype.genDom = function() {
        this.codeWin = document.createElement('div')
        this.codeWin.style.cssText = 'position:relative;width:100%;height:100%;overflow: hidden;'
        if(this.bgImg) {
            this.codeWin.style.cssText += 'background: url(' + this.bgImg + ') no-repeat;'
            + 'background-size: 100% 100%;'
        } else if(this.bgColor) { 
            this.codeWin.style.cssText += 'background: ' + this.bgColor + ';'
        }
        document.getElementById(this.container).appendChild(this.codeWin)
    }
    //校验码样式表
    NewVC.prototype.styleOption = function() {
        this.codeStyle = {
            fontSizeMin: 20,
            fontSizeMax: 38,
            colors: [
                '#00FF00',
                '#0000FF',
                '#FF0000',
                '#53da33',
                '#AA0000',
                '#FFBB00',
                '#551A8B',
                '#8B008B'
            ],
            fonts: [
                'Microsoft Yahei',
                'tahoma',
                'arial',
                'Hiragino Sans GB',
                'helvetica neue',
                'helvetica',
                'arial',
                'Sans-serif',
                'Hiragino Sans GB',
                'Hiragino Sans GB W3',
                'SimHei'
            ],
            lineColors: [
                '#888888',
                '#FF7744',
                '#888800',
                '#008888'
            ],
            lineStyles: [
                'dashed',
                'solid',
                'dotted',
                'double',
                'ridge'
            ]
        }
    }
    //绘制随机校验码
    NewVC.prototype.drawCode = function() {
        this.genRandStr()
        var widthUnit = (this.codeWin.clientWidth || this.width) / this.code.length
        console.log('widthUnit', widthUnit)
        for(var i = 0; i < this.code.length; i++) {
            var codeDom = document.createElement('span')
            codeDom.style.cssText = 'position:absolute;'
                + 'top:' + this.randInt(0, 15) + '%;'
                + 'left:' + this.randInt(widthUnit * i, widthUnit * i + widthUnit - 20) + 'px;'
                + 'font-size:' + this.randInt(this.codeStyle.fontSizeMin, this.codeStyle.fontSizeMax) + 'px;'
                + 'color:' + this.codeStyle.colors[this.randInt(0,         this.codeStyle.colors.length)] + ';'
                + 'font-family:' + this.codeStyle.fonts[this.randInt(0, this.codeStyle.fonts.length)] + ';'
                + 'font-weight:' + this.randInt(200, 900) + ';'
                + 'transform:rotate(' + this.randInt(-35, 35) + 'deg);'
                + '-ms-transform:rotate(' + this.randInt(-35, 35) + 'deg);'
                + '-webkit-transform:rotate(' + this.randInt(-35, 35) + 'deg);'
                + '-ms-transform:rotate(' + this.randInt(-35, 35) + 'deg);'
                + '-moz-transform:rotate(' + this.randInt(-35, 35) + 'deg);'
                + '-o-transform:rotate(' + this.randInt(-35, 35) + 'deg);'
            codeDom.innerHTML = this.code[i]
            this.codeWin.appendChild(codeDom)
        }
    }
    //绘制干扰线条
    NewVC.prototype.drawLines = function() {
        for(var i = 0; i < 8; i++) {
            var lineDom = document.createElement('hr')
            lineDom.style.cssText = 'position:absolute;'
                + 'top:' + this.randInt(0, 99) + '%;'
                + 'left:' + this.randInt(0, 80) + '%;'
                + 'border:0;'
                + 'border-top:' + this.randInt(1, 5) + 'px ' + this.codeStyle.lineStyles[this.randInt(0, this.codeStyle.lineStyles.length)] + ';'
                + 'border-color:' + this.codeStyle.lineColors[this.randInt(0,         this.codeStyle.lineColors.length)] + ';'
                + 'width:' + this.randInt(10, this.codeWin.clientWidth) + 'px;'
                + 'opacity:' + this.randInt(3, 8) / 10 + ';'
                + 'transform:rotate(' + this.randInt(-35, 35) + 'deg);'
                + '-ms-transform:rotate(' + this.randInt(-35, 35) + 'deg);'
                + '-webkit-transform:rotate(' + this.randInt(-35, 35) + 'deg);'
                + '-ms-transform:rotate(' + this.randInt(-35, 35) + 'deg);'
                + '-moz-transform:rotate(' + this.randInt(-35, 35) + 'deg);'
                + '-o-transform:rotate(' + this.randInt(-35, 35) + 'deg);'
            this.codeWin.appendChild(lineDom)
        }
    }
    //清空校验码
    NewVC.prototype.clean = function() {
        this.input.value = ''
        this.code = ''
        this.codeWin.innerHTML = ''
    }
    //更新校验码
    NewVC.prototype.refresh = function() {
        this.clean()
        this.drawCode()
        this.drawLines()
    }
    //获取校验结果
    NewVC.prototype.verify = function() {
        var inputCode = this.input.value
        inputCode = inputCode.trim().toLowerCase()
        var code = this.code.toLowerCase()
        if(inputCode === code) {
            return true
        } else {
            return false
        }
    }

    return NewVC
}())

//采用模块化引入时使用该句
//module.exports = Yverifycode