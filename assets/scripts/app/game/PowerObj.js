//挤牌权转移的对象
var BaseObj = require("BaseObj")
var stateEnmu = require("GameConfig").stateEnmu
cc.Class({
    extends: BaseObj,

    properties: {

    },

    onLoad: function () {
        var gameView = cc.gameMgr.view
        var offset
        var touchNode = this.node
        var oldPos = clone(touchNode.position)
        var size = touchNode._contentSize
        this.flagMovePowerObj = true
        touchNode.on(cc.Node.EventType.TOUCH_START, function (touch) {
            var beginPos = touchNode.parent.convertTouchToNodeSpaceAR(touch)
            offset = { x: beginPos.x - touchNode.position.x, y: beginPos.y - touchNode.position.y }
            cc.gameMgr.view.find("player1").hideoveFirstTips()
        }, this);
        touchNode.on(cc.Node.EventType.TOUCH_MOVE, function (touch) {
            if (("node_quanxian_xian" == this.node._name && cc.gameMgr.jipaiXianUid == cc.gameMgr._myData.user_base_info.uid) ||
                ("node_quanxian_zhuang" == this.node._name && cc.gameMgr.jipaiZhuangUid == cc.gameMgr._myData.user_base_info.uid)) {
                var pos = touchNode.parent.convertTouchToNodeSpaceAR(touch)
                touchNode.position = { x: pos.x - offset.x, y: pos.y - offset.y }
                this.handleMovePowerObj()
            }
        }, this)

        var touchCb = function (touch) {
            var backToMyself = function () {
                var player
                //拖动挤牌权在别的地方会自动回去原玩家身上
                if ("node_quanxian_xian" == this.node._name && cc.gameMgr.jipaiXianUid) {
                    player = cc.gameMgr.view.getPlayerByUid(cc.gameMgr.jipaiXianUid)
                }
                if ("node_quanxian_zhuang" == this.node._name && cc.gameMgr.jipaiZhuangUid) {
                    player = cc.gameMgr.view.getPlayerByUid(cc.gameMgr.jipaiZhuangUid)
                }
                if (player) {
                    this.move(player.node.position)
                }
            }.bind(this)
            if (stateEnmu.TRANS_PERMI != gUserData.roomInfo.game_status) {
                backToMyself()
                // cc.common.showMsgBox({ type: 1, msg: "不在转移阶段" })
                return
            }
            for (var i = 1; i <= 9; i++) {
                var player = gameView.find("player" + i)
                if (player.data && player.node.getBoundingBox().intersects(this.node.getBoundingBox())) {
                    this.move(player.node.position)
                    cc.gameMgr.reqTransCardPermisssion({ targ_uid: player.getUid() })
                    return
                }
            }
            backToMyself()
        }.bind(this)

        touchNode.on(cc.Node.EventType.TOUCH_END, touchCb, this)
        touchNode.on(cc.Node.EventType.TOUCH_CANCEL, touchCb, this)
    },

    move: function (pos, callback) {
        this.node.stopAllActions()
        var moveTo = cc.moveTo(0.1, pos)
        var cb = cc.callFunc(function () {
            if (callback) {
                callback()
            }
        })
        var seq = cc.sequence(moveTo, cb)
        this.node.runAction(seq)
        cc.musicMgr.playEffect("trans_power_obj.mp3")
    },

    flip: function (cb) {
        this.node.stopAllActions()
        var cb1 = cc.callFunc(function () {
            this.find("front").node.active = false
            this.find("back").node.active = true
        }.bind(this))
        //判断挤牌权是否在玩家身上
        var isOnPlayer = function () {
            if ("node_quanxian_xian" == this.node._name) {
                cc.log("xxxx", this.node.position , cc.gameMgr.view.pos_quanxian_xian, this.node.position != cc.gameMgr.view.pos_quanxian_xian)
                return !(this.node.position.x == cc.gameMgr.view.pos_quanxian_xian.x && this.node.position.y == cc.gameMgr.view.pos_quanxian_xian.y)
            }
            else  {
                return !(this.node.position.x == cc.gameMgr.view.pos_quanxian_zhuang.x && this.node.position.y == cc.gameMgr.view.pos_quanxian_zhuang.y)
            }
        }.bind(this)
        var cb2 = cc.callFunc(function () {
            if (cb) {
                cb()
            }
            if (isOnPlayer()) {
                this.node.active = false
            }
        }.bind(this))
        var act1 = cc.sequence(cc.scaleTo(0.4, 1, 0), cb1)
        // var act2 = cc.sequence(cc.scaleTo(0.4, 1, 1), cb2)
        var act2 = cc.scaleTo(0.4, 1, 1)
        var seq = cc.sequence(act1, act2, cc.delayTime(1), cb2)
        this.node.runAction(seq)
    },

    handleMovePowerObj: function () {
        if (true == this.flagMovePowerObj && stateEnmu.TRANS_PERMI == gUserData.roomInfo.game_status) {
            this.flagMovePowerObj = false
            var typeMap = {
                "node_quanxian_zhuang" : 1,
                "node_quanxian_xian" : 2
            }
            var list = cc.gameMgr.view.getCanMovePowerObjPlayers(typeMap[this.node._name])
            for (var i = 0; i < list.length; i++) {
                var player = list[i]
                player.showCanMovePowerObjAni()
            }
        }
    },

    reset: function () {
        this.node.stopAllActions()
        this.node.setScale(1)
        this.node.active = true
        this.find("front").node.active = true
        this.find("back").node.active = false
        this.flagMovePowerObj = true
        if ("node_quanxian_xian" == this.node._name) {
            this.node.position = cc.gameMgr.view.pos_quanxian_xian
        }
        if ("node_quanxian_zhuang" == this.node._name) {
            this.node.position = cc.gameMgr.view.pos_quanxian_zhuang
        }
    }

});
