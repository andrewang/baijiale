cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        isCanSend: true,
    },

    onLoad: function () {

    },

    init: function (params) {
        if (cc.sys.isBrowser) {
            return
        }
        this.params = params
        this.posX = 0
        this.posY = 0
        this.offsetRatioval = 0
        this.ratioVal = 0
        this.radiusVal = 0
        this.rotateAngle = 0
        // this.szBack = "threeDCards/kabei.png"
        // this.szFont = "threeDCards/black_3.png"
        // this.szBack = (params && params.back) || "poker_head_left_1/poker.png"
        // this.szFont = (params && params.front) || "poker_head_left_1/poker_red_j.png"
        this.szBack = (params && params.back) || "threeDCards/kabei.png"
        this.szFont = (params && params.front) || "threeDCards/red_j.png"
        this.pokerScale = (params && params.scale) || 1
        this.RubCardLayer_State_Move = 0
        this.RubCardLayer_State_Smooth = 1
        var RubCardLayer_Pai = 3.141592
        this.RubCardLayer_RotationFrame = 10
        this.RubCardLayer_RotationAnger = RubCardLayer_Pai / 3
        this.RubCardLayer_SmoothFrame = 10
        this.RubCardLayer_SmoothAnger = RubCardLayer_Pai / 6
        this.limitRatioVal = 0.96

        this.state = this.RubCardLayer_State_Move

        this.createTextures()
        this.initTexAndPos(true)
        this.initTexAndPos(false)
        this.createGlNode()
        this.createAllProgram()
        this.registTouchEvent()
        this.radiusVal = this.pokerHeight / 10
    },

    rotate: function () {
        this.ratioVal = 0 //旋转ratioVal从0开始计算
        if (90 == this.rotateAngle) {
            this.rotateAngle = 0
        }
        else if (0 == this.rotateAngle) {
            this.rotateAngle = 90
        }

        var cb = function () {
            this.releaseGL()
            
            if (0 == this.rotateAngle) {
                this.limitRatioVal = 0.96
                //无限旋转
                this.node.rotation = 0
            }
            else if (90 == this.rotateAngle) {
                this.limitRatioVal = 0.68
            }

            this.createTextures()
            this.initTexAndPos(true)
            this.initTexAndPos(false)
            this.createGlNode()
            this.createAllProgram()
        }.bind(this)

        var callbackfunc = cc.callFunc(function () {
            cb()
        }.bind(this))
        // var seq = cc.sequence(cc.rotateTo(0.2, -this.rotateAngle), callbackfunc)
        var seq = cc.sequence(cc.rotateBy(0.2, -90), callbackfunc)
        this.node.runAction(seq)
        // cb()
    },

    createGlNode: function () {
        var glnode = new cc.GLNode()
        this.node._sgNode.addChild(glnode, 10)
        this.glnode = glnode
        this.smoothFrame = 1
        this.isCreateNum = false

        glnode.draw = function () {
            if (this.state == this.RubCardLayer_State_Move) {
                this.drawByMoveProgram(0)
            }
            else if (this.state == this.RubCardLayer_State_Smooth) {
                if (this.params && this.params.cardJs) {
                    this.params.cardJs.requestSqueeze()
                    this.params = null //避免多次发送协议
                    return
                }
                //如果旋转了，角度也要摆正
                // this.node.rotation = 0
                
                if (this.smoothFrame <= this.RubCardLayer_RotationFrame) {
                    // this.drawByMoveProgram(-this.RubCardLayer_RotationAnger*this.smoothFrame/this.RubCardLayer_RotationFrame)
                }
                else if (this.smoothFrame < (this.RubCardLayer_RotationFrame + this.RubCardLayer_SmoothFrame)) {
                    var scale = (this.smoothFrame - this.RubCardLayer_RotationFrame) / this.RubCardLayer_SmoothFrame
                    // this.drawBySmoothProgram(Math.max(0.01,this.RubCardLayer_SmoothAnger*(1-scale)))
                }
                else {
                    //第一次到这里就铺平了
                    this.drawByEndProgram()
                }
                this.smoothFrame = this.smoothFrame + 1
            }
        }.bind(this)
    },

    registTouchEvent: function () {
        var startPt, endPt
        this.node.on(cc.Node.EventType.TOUCH_START, function (touch) {
            this.params.cardJs.showFirstSquezze(false)
            startPt = touch.getLocation()
            var location = touch.getLocation()
            this.touchStartY = location.y
        }.bind(this), this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (touch) {
            if (cc.gameMgr.curJipaiPlayerUid != cc.gameMgr._myData.user_base_info.uid) {
                return
            }
            var location = touch.getLocation()
            this.ratioVal = (location.y - this.touchStartY) / this.pokerHeight + this.offsetRatioval
            this.ratioVal = Math.max(0, this.ratioVal)
            this.ratioVal = Math.min(this.limitRatioVal, this.ratioVal)

            if (this.isCanSend) {
                this.isCanSend = false
                var pos = { ratioVal : this.ratioVal, index: this.params.cardJs.data.index }
                cc.netMgr.request("room_game_squeeze_cards_pos", { pos: pos }, function (ret) {
                    cc.netMgr.exec(ret, function () {
                    })
                })
                //设置发送协议的时间间隔
                setTimeout(function () {
                    this.isCanSend = true
                }.bind(this), 10)
            }

        }.bind(this), this)

        var endFunc = function (touch) {
            if (cc.gameMgr.curJipaiPlayerUid != cc.gameMgr._myData.user_base_info.uid) {
                return
            }
            endPt = touch.getLocation()
            //点击旋转
            if (this.ratioVal <= 0.05 && cc.pDistance(startPt, endPt) <= 10) {
                var pos = { isRotate : true, index: this.params.cardJs.data.index }
                cc.netMgr.request("room_game_squeeze_cards_pos", { pos: pos }, function (ret) {
                    cc.netMgr.exec(ret, function () {
                    })
                })
                this.rotate()
            }
            this.offsetRatioval = this.ratioVal
            if (this.ratioVal >= this.limitRatioVal) {
                this.state = this.RubCardLayer_State_Smooth
            }
        }.bind(this)
        this.node.on(cc.Node.EventType.TOUCH_END, endFunc, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, endFunc, this)
    },

    createAllProgram: function () {
        var moveVertSource = require("move.vert")
        var smoothVertSource = require("smooth.vert")
        var endVertSource = require("end.vert")

        var strFragSource = require("jipai.frag")

        var moveGlProgram = this.moveGlProgram = this.createProgram(moveVertSource, strFragSource)
        var smoothGlProgram = this.smoothGlProgram = this.createProgram(smoothVertSource, strFragSource)
        var endGlProgram = this.endGlProgram = this.createProgram(endVertSource, strFragSource)
        this.moveGlProgram.retain()
        this.smoothGlProgram.retain()
        this.endGlProgram.retain()

        moveGlProgram.rotationLc = gl.getUniformLocation(moveGlProgram.getProgram(), "rotationLc")
        moveGlProgram.ratio = gl.getUniformLocation(moveGlProgram.getProgram(), "ratio")
        moveGlProgram.radius = gl.getUniformLocation(moveGlProgram.getProgram(), "radius")
        moveGlProgram.offx = gl.getUniformLocation(moveGlProgram.getProgram(), "offx")
        moveGlProgram.offy = gl.getUniformLocation(moveGlProgram.getProgram(), "offy")
        moveGlProgram.Height = gl.getUniformLocation(moveGlProgram.getProgram(), "height")
        moveGlProgram.Width = gl.getUniformLocation(moveGlProgram.getProgram(), "width")
        moveGlProgram.rotation = gl.getUniformLocation(moveGlProgram.getProgram(), "rotation")

        smoothGlProgram.rotationLc = gl.getUniformLocation(smoothGlProgram.getProgram(), "rotationLc")
        smoothGlProgram.offx = gl.getUniformLocation(smoothGlProgram.getProgram(), "offx")
        smoothGlProgram.offy = gl.getUniformLocation(smoothGlProgram.getProgram(), "offy")
        smoothGlProgram.Height = gl.getUniformLocation(smoothGlProgram.getProgram(), "height")
        smoothGlProgram.Width = gl.getUniformLocation(smoothGlProgram.getProgram(), "width")

        endGlProgram.offx = gl.getUniformLocation(endGlProgram.getProgram(), "offx")
        endGlProgram.offy = gl.getUniformLocation(endGlProgram.getProgram(), "offy")
        endGlProgram.Height = gl.getUniformLocation(endGlProgram.getProgram(), "height")
        endGlProgram.Width = gl.getUniformLocation(endGlProgram.getProgram(), "width")
        endGlProgram.rotation = gl.getUniformLocation(endGlProgram.getProgram(), "rotation")
    },

    createProgram: function (vsource, fsource) {
        var glProgram = cc.GLProgram.createWithByteArrays(vsource, fsource)
        glProgram.link()
        glProgram.updateUniforms()
        return glProgram
    },

    drawByMoveProgram: function (rotationLc) {
        var glProgram = this.moveGlProgram
        gl.enable(gl.CULL_FACE)
        glProgram.use()
        glProgram.setUniformsForBuiltins()

        glProgram.setUniformLocationF32(glProgram.rotationLc, rotationLc)
        glProgram.setUniformLocationF32(glProgram.ratio, this.ratioVal)
        glProgram.setUniformLocationF32(glProgram.radius, this.radiusVal)
        glProgram.setUniformLocationF32(glProgram.offx, this.offx)
        glProgram.setUniformLocationF32(glProgram.offy, this.offy)
        glProgram.setUniformLocationF32(glProgram.Height, this.pokerHeight)
        glProgram.setUniformLocationF32(glProgram.Width, this.pokerWidth)
        glProgram.setUniformLocationF32(glProgram.rotation, this.rotateAngle)

        gl.bindTexture(gl.TEXTURE_2D, this.backSpriteId)
        this.drawArrays(this.backPosBuffer, this.backTexBuffer)
        gl.bindTexture(gl.TEXTURE_2D, this.frontSpriteId)
        this.drawArrays(this.frontPosBuffer, this.frontTexBuffer)
        gl.disable(gl.CULL_FACE)
    },

    drawBySmoothProgram: function (rotationLc) {
        var glProgram = this.smoothGlProgram
        glProgram.use()
        glProgram.setUniformsForBuiltins()

        gl.bindTexture(gl.TEXTURE_2D, this.frontSpriteId)
        glProgram.setUniformLocationF32(glProgram.rotationLc, rotationLc)
        glProgram.setUniformLocationF32(glProgram.offx, this.offx)
        glProgram.setUniformLocationF32(glProgram.offy, this.offy)
        glProgram.setUniformLocationF32(glProgram.Height, this.pokerHeight)
        glProgram.setUniformLocationF32(glProgram.Width, this.pokerWidth)

        this.drawArrays(this.frontPosBuffer, this.frontTexBuffer)
    },

    drawByEndProgram: function () {
        var glProgram = this.endGlProgram
        glProgram.use()
        glProgram.setUniformsForBuiltins()

        gl.bindTexture(gl.TEXTURE_2D, this.frontSpriteId)
        glProgram.setUniformLocationF32(glProgram.offx, this.offx)
        glProgram.setUniformLocationF32(glProgram.offy, this.offy)
        glProgram.setUniformLocationF32(glProgram.Height, this.pokerHeight)
        glProgram.setUniformLocationF32(glProgram.Width, this.pokerWidth)
        glProgram.setUniformLocationF32(glProgram.rotation, this.rotateAngle)
        this.drawArrays(this.frontPosBuffer, this.frontTexBuffer)
    },

    drawArrays: function (pos, tex) {
        var VERTEX_ATTRIB_FLAG_POSITION = 1
        var VERTEX_ATTRIB_FLAG_TEX_COORDS = 4
        // cc.glEnableVertexAttribs(VERTEX_ATTRIB_FLAG_TEX_COORDS | VERTEX_ATTRIB_FLAG_POSITION)
        gl.glEnableVertexAttribs(VERTEX_ATTRIB_FLAG_TEX_COORDS | VERTEX_ATTRIB_FLAG_POSITION)
        var VERTEX_ATTRIB_POSITION = 0
        var VERTEX_ATTRIB_TEX_COORDS = 2
        gl.bindBuffer(gl.ARRAY_BUFFER, pos)
        gl.vertexAttribPointer(VERTEX_ATTRIB_POSITION, 2, gl.FLOAT, 0, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, tex)
        gl.vertexAttribPointer(VERTEX_ATTRIB_TEX_COORDS, 2, gl.FLOAT, 0, 0, 0)
        gl.drawArrays(gl.TRIANGLES, 0, this.posTexNum)
        gl.bindBuffer(gl.ARRAY_BUFFER, 0)
    },

    initTexAndPos: function (isBack) {
        var nDiv = 20 //将宽分成100份
        var verts = new Array() //位置坐标
        var texs = new Array() //纹理坐标
        var dh, dw
        if (0 == this.rotateAngle) {
            dh = this.pokerHeight / nDiv
            dw = this.pokerWidth
        }
        else if (90 == this.rotateAngle) {
            dh = this.pokerHeight
            dw = this.pokerWidth / nDiv
        }

        //计算顶点位置
        for (var c = 1; c <= nDiv; c++) {
            var x, y
            if (0 == this.rotateAngle) {
                x = 0
                y = (c - 1) * dh
            }
            else if (90 == this.rotateAngle) {
                x = (c - 1) * dw
                y = 0
            }

            var quad = null
            if (isBack) {
                quad = new Array(x, y, x + dw, y, x, y + dh, x + dw, y, x + dw, y + dh, x, y + dh)
            }
            else {
                quad = new Array(x, y, x, y + dh, x + dw, y, x + dw, y, x, y + dh, x + dw, y + dh)
            }
            for (var i = 0; i <= 5; i++) {
                var quadX = quad[i * 2]
                var quadY = quad[i * 2 + 1]
                var numX = quadX / this.pokerWidth
                var numY = quadY / this.pokerHeight
                texs.push(Math.max(0, numX))
                texs.push(Math.max(0, numY))
            }
            for (var k in quad) {
                verts.push(quad[k])
            }
        }
        var posBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        this.posTexNum = verts.length / 2

        var texBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texs), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        if (isBack) {
            this.backPosBuffer = posBuffer.buffer_id
            this.backTexBuffer = texBuffer.buffer_id
        }
        else {
            this.frontPosBuffer = posBuffer.buffer_id
            this.frontTexBuffer = texBuffer.buffer_id
        }
    },

    createTextures: function () {
        var imgUrl = cc.url.raw("resources/" + this.szFont)
        this.frontSprite = cc.textureCache.addImage(imgUrl)
        this.frontSprite.retain()

        imgUrl = cc.url.raw("resources/" + this.szBack)
        this.backSprite = cc.textureCache.addImage(imgUrl)
        this.backSprite.retain()

        var pokerSize = this.backSprite.getContentSize()
        this.pokerWidth = pokerSize.width * this.pokerScale
        this.pokerHeight = pokerSize.height * this.pokerScale

        this.offx = this.posX - this.pokerWidth / 2
        this.offy = this.posY - this.pokerHeight / 2
        this.backSpriteId = this.backSprite.getName()
        this.frontSpriteId = this.frontSprite.getName()
    },

    //结束需要移除
    releaseGL: function () {
        cc.log("3d挤牌onDestroy")
        if (cc.sys.isBrowser) {
            return
        }
        if (!this.node) {
            return
        }
        this.node._sgNode.removeChild(this.glnode)
        gl._deleteBuffer(this.backPosBuffer)
        gl._deleteBuffer(this.backTexBuffer)
        gl._deleteBuffer(this.frontPosBuffer)
        gl._deleteBuffer(this.frontTexBuffer)
        this.moveGlProgram.release()
        this.smoothGlProgram.release()
        this.endGlProgram.release()
        this.backSprite.release()
        this.frontSprite.release()
    },

    getSize: function () {
        return { width: this.pokerWidth, height: this.pokerHeight }
    },
})

