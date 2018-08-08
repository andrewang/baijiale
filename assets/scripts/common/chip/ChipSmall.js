var BaseObj = require("BaseObj")

var clientBetState = require("GameConfig").clientBetState

var prePath = "chip/cmbc/"
var chipConfig = {}
chipConfig["xian1"] = { size: { width: 59, height: 59 }, spPath: "xian/0_" }
chipConfig["zhuang1"] = { size: { width: 51, height: 50 }, spPath: "zhuang/0_" }
chipConfig["xian2"] = { size: { width: 60, height: 58 }, spPath: "xian/20_" }
chipConfig["zhuang2"] = { size: { width: 52, height: 49 }, spPath: "zhuang/20_" }
chipConfig["xian3"] = { size: { width: 59, height: 56 }, spPath: "xian/40_" }
chipConfig["zhuang3"] = { size: { width: 51, height: 48 }, spPath: "zhuang/40_" }
chipConfig["xian4"] = { size: { width: 58, height: 51 }, spPath: "xian/60_" }
chipConfig["zhuang4"] = { size: { width: 51, height: 46 }, spPath: "zhuang/60_" }
chipConfig["xian5"] = { size: { width: 54, height: 46 }, spPath: "xian/90_" }
chipConfig["zhuang5"] = { size: { width: 49, height: 42 }, spPath: "zhuang/90_" }

// chipConfig["xian6"] = chipConfig["xian5"]
// chipConfig["zhuang6"] = chipConfig["zhuang5"]
// chipConfig["xian7"] = chipConfig["xian4"]
// chipConfig["zhuang7"] = chipConfig["zhuang4"]
// chipConfig["xian8"] = chipConfig["xian3"]
// chipConfig["zhuang8"] = chipConfig["zhuang3"]
// chipConfig["xian9"] = chipConfig["xian2"]
// chipConfig["zhuang9"] = chipConfig["zhuang2"]

chipConfig["xian6"] = { size: { width: 54, height: 46 }, spPath: "xian/-90_" }
chipConfig["zhuang6"] = { size: { width: 49, height: 42 }, spPath: "zhuang/-90_" }
chipConfig["xian7"] = { size: { width: 58, height: 51 }, spPath: "xian/-60_" }
chipConfig["zhuang7"] = { size: { width: 51, height: 46 }, spPath: "zhuang/-60_" }
chipConfig["xian8"] = { size: { width: 59, height: 56 }, spPath: "xian/-40_" }
chipConfig["zhuang8"] = { size: { width: 51, height: 48 }, spPath: "zhuang/-40_" }
chipConfig["xian9"] = { size: { width: 60, height: 58 }, spPath: "xian/-20_" }
chipConfig["zhuang9"] = { size: { width: 52, height: 49 }, spPath: "zhuang/-20_" }

chipConfig["he_my"] = { size: { width: 51, height: 50 }, spPath: "zhuang/0_" }
chipConfig["he_other"] = { size: { width: 51, height: 50 }, spPath: "zhuang/0_" }
chipConfig["xiandui_my"] = { size: { width: 51, height: 46 }, spPath: "zhuang/60_" }
chipConfig["xiandui_other"] = { size: { width: 51, height: 48 }, spPath: "zhuang/40_" }
chipConfig["zhuangdui_my"] = { size: { width: 52, height: 49 }, spPath: "xian/40_" }
chipConfig["zhuangdui_other"] = { size: { width: 51, height: 46 }, spPath: "zhuang/60_" }

cc.Class({
    extends: BaseObj,

    properties: {
        value: 0,
    },

    // use this for initialization
    onLoad: function () {
        this._super()

        this.init()
    },

    init: function () {
        // this.num = 0
    },

    //data {value, area, clientSeatId, seatData}
    setData: function (data) {
        this.data = data
        // this.find("imgBg").spriteFrame = cc.res["chip/chip_" + data.value]
        //获取索引key
        var indexName = clientBetState[data.area]
        if (1 == data.area || 2 == data.area) {
            indexName = indexName + data.clientSeatId
        }
        else {
            // if (1 == data.clientSeatId) {
            if (data.seatData.user_base_info.uid == gUserData.uid) {
                indexName = indexName + "_my"
            } else {
                indexName = indexName + "_other"
            }
        }
        var config = chipConfig[indexName]
        // var fullSpPath = prePath + config.spPath + data.value
        var fullSpPath = "chip/" + data.value
        cc.resMgr.updateSprite(this.find("imgBg"), fullSpPath)
        // this.node.setContentSize(config.size)
        this.node.setContentSize({ width: 85, height: 88 })
        this.find("txtNum").string = data.value
    },

    getValue: function () {
        return this.data.value
    },

    move: function (pos, callback) {
        this.node.stopAllActions()
        var dis = cc.pDistance(this.node.position, pos)
        var time = Math.ceil(dis / 100) * 0.1
        var moveTo = cc.moveTo(time, pos)
        var cb = cc.callFunc(function () {
            if (callback) {
                callback()
            }
        })
        var seq = cc.sequence(moveTo, cb)
        this.node.runAction(seq)

        //test
        // this.node.position = pos
    },

    // settle: function (pos) {
    //     var worldPos = cc.gameMgr.view.node.convertToWorldSpaceAR(this.node.parent.parent.position)
    //     var localPos = cc.gameMgr.view.find("nodeBetMove").convertToNodeSpaceAR(worldPos)
    //     this.node.removeFromParent()
    //     cc.gameMgr.view.find("nodeBetMove").addChild(this.node)
    //     this.node.position = localPos
        
    //     this.move(pos, function () {
    //         this.node.destroy()
    //     }.bind(this))
    // },
});
