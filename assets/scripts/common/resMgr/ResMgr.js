var prefabsUrlList = []
prefabsUrlList.push("prefabs/createRoom/CreateRoomView")
prefabsUrlList.push("prefabs/joinRoom/JoinRoomView")
prefabsUrlList.push("prefabs/joinRoom/RoomInfoView")
prefabsUrlList.push("prefabs/msgBox/MsgBox")
prefabsUrlList.push("prefabs/player/Player")
prefabsUrlList.push("prefabs/player/PlayerInfoView")
prefabsUrlList.push("prefabs/card/Card")
// prefabsUrlList.push("prefabs/chip/Chip")
prefabsUrlList.push("prefabs/chip/ChipSmall")
prefabsUrlList.push("prefabs/wayBill/WayBillView")
prefabsUrlList.push("prefabs/wayBill/QipailuItem")
prefabsUrlList.push("prefabs/wayBill/BigwayItem")
prefabsUrlList.push("prefabs/wayBill/BigEyeWayItem")
prefabsUrlList.push("prefabs/wayBill/SmallWayItem")
prefabsUrlList.push("prefabs/wayBill/SmQiangWayItem")
prefabsUrlList.push("prefabs/totalResult/TotalResultView")
prefabsUrlList.push("prefabs/singleResult/SingleResultView")
prefabsUrlList.push("prefabs/settingView/SettingView")
prefabsUrlList.push("prefabs/dismissRoom/DismissRoomView")
prefabsUrlList.push("prefabs/chat/ChatView")
prefabsUrlList.push("prefabs/battleRecord/TotalBattleRecordView")
prefabsUrlList.push("prefabs/battleRecord/TotalBattleRecordItem")
prefabsUrlList.push("prefabs/battleRecord/SingleBattleRecordView")
prefabsUrlList.push("prefabs/battleRecord/SingleBattleRecordItem")
prefabsUrlList.push("prefabs/ruleView/RuleView")
prefabsUrlList.push("prefabs/share/ShareView")
prefabsUrlList.push("prefabs/share/ShareView2")
prefabsUrlList.push("prefabs/share/InvitationView")
prefabsUrlList.push("prefabs/logView/LogView")
prefabsUrlList.push("prefabs/mall/mallView")
prefabsUrlList.push("prefabs/notice/noticePopView")
prefabsUrlList.push("prefabs/notice/noticeView")
prefabsUrlList.push("prefabs/notice/noticeItem")

var prefixTbl = {}
prefixTbl[1] = "poker_head_left_1/"
prefixTbl[2] = "poker_head_left_2/"
prefixTbl[3] = "poker_head_right_1/"
prefixTbl[4] = "poker_head_right_2/"
prefixTbl[5] = "poker_head_left_3/"
prefixTbl[6] = "poker_head_right_3/"

var valueStr = {}
valueStr[1] = "a"
valueStr[2] = "2"
valueStr[3] = "3"
valueStr[4] = "4"
valueStr[5] = "5"
valueStr[6] = "6"
valueStr[7] = "7"
valueStr[8] = "8"
valueStr[9] = "9"
valueStr[10] = "10"
valueStr[11] = "j"
valueStr[12] = "q"
valueStr[13] = "k"

var pokerType = ["black", "red", "mh", "fk"]

cc.Class({
    extends: cc.Component,

    properties: {

    },

    ctor: function () {
        this.resList = {}

        this._loadNum = 0
        this._loadCompleteNum = 0
    },

    init: function () {
        var view = cc.sceneNode.js.showLoadingView()
        this.loadSpriteFrame("chip/chip_1")
        this.loadSpriteFrame("chip/chip_5")
        this.loadSpriteFrame("chip/chip_10")
        this.loadSpriteFrame("chip/chip_50")
        this.loadSpriteFrame("chip/chip_100")

        this.loadWayBill()
        this.loadTotalResult()

        //加载预制节点
        for (var k in prefabsUrlList) {
            this.loadPrefab(prefabsUrlList[k])
        }
        
        // this.loadGameRes()
    },

    loadSpriteFrame: function (url) {
        var self = this
        this._loadNum++
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            self.resList[url] = spriteFrame
            self._loadCompleteNum++
            self.checkAllLoad()
        })
    },

    loadPrefab: function (url) {
        var self = this
        this._loadNum++
        cc.loader.loadRes(url, function (err, prefab) {
            self.resList[url] = prefab
            self._loadCompleteNum++
            self.checkAllLoad()
        })
    },

    releaseAll: function () {
        
    },

    checkAllLoad: function () {
        if (this._loadNum == this._loadCompleteNum) {
            cc.log("load All")
            cc.eventMgr.emit("resMgrResAllLoaded")
            // var view = cc.sceneNode.js.showLoadingView()
            // view.hide()
            //切换场景就不需要hide了，view是附加在场景上的
            // cc.sceneNode.js.hideLoadingView()
            cc.director.loadScene("LobbyScene")
        }
        else {
            // var view = cc.sceneNode.js.showLoadingView()
            cc.eventMgr.emit("loadRes", {loadNum : this._loadNum, completeNum : this._loadCompleteNum})
        }
    },

    //加载游戏里面需要的资源
    loadGameRes: function () {
        // //卡图案
        // for (var k = 1; k <= 6; k++) {
        //     for (var i = 0; i < 4; i++) {
        //         for (var j = 1; j <= 13; j++) {

        //             var url = prefixTbl[k] + "poker_" + pokerType[i] + "_" + valueStr[j] + "@2x"
        //             this.loadSpriteFrame(url)
        //         }
        //     }
        // }
        // //卡面卡背
        // for (var k = 1; k <= 6; k++) {
        //     var url = prefixTbl[k] + "poker@2x"
        //     this.loadSpriteFrame(url)
        //     url = prefixTbl[k] + "poker_front@2x"
        //     this.loadSpriteFrame(url)
        // }

        for (var j = 1; j <= 10; j++) {
            var url = "discardBg/poker_back_" + j
            this.loadSpriteFrame(url)
        }
    },

    //加载路单需要的资源
    loadWayBill: function () {
        var waybillRes = []
        waybillRes.push("waybill/bigway_xian")
        waybillRes.push("waybill/bigway_zhuang")
        waybillRes.push("waybill/forecast0no")
        waybillRes.push("waybill/forecast0yes")
        waybillRes.push("waybill/forecast1no")
        waybillRes.push("waybill/forecast1yes")
        waybillRes.push("waybill/forecast2no")
        waybillRes.push("waybill/forecast2yes")
        waybillRes.push("waybill/he")
        waybillRes.push("waybill/zhuang")
        waybillRes.push("waybill/xian")
        waybillRes.push("waybill/smallway_blue")
        waybillRes.push("waybill/smallway_red")
        waybillRes.push("waybill/smqiangwayBlue")
        waybillRes.push("waybill/smqiangwayRed")
        waybillRes.push("waybill/wayBillPreview1")
        waybillRes.push("waybill/wayBillPreview2")
        waybillRes.push("waybill/wayBillPreview3")

        for (var k in waybillRes) {
            this.loadSpriteFrame(waybillRes[k])
        }
    },

    loadTotalResult: function () {
        for (var i = 0; i < 4; i++) {
            for (var j = 1; j <= 13; j++) {
                var url = "poker_result/" + "poker_" + pokerType[i] + "_" + valueStr[j]
                this.loadSpriteFrame(url)
            }
        }
    },

    //获取扑克的spriteFrame
    getCardResName: function (params) {
        var prefixTbl = {}
        prefixTbl[1] = "poker_head_left_1/"
        prefixTbl[2] = "poker_head_left_2/"
        prefixTbl[3] = "poker_head_right_1/"
        prefixTbl[4] = "poker_head_right_2/"
        prefixTbl[5] = "poker_head_left_3/"
        prefixTbl[6] = "poker_head_right_3/"

        var url = prefixTbl[params.index] + "poker_" + pokerType[params.type - 1] + "_" + valueStr[params.num]
        // cc.log("res:", cc.res[url], url)
        // return cc.res[url]
        return url
    },

    getCardBackName: function (params) {
        var url = prefixTbl[params.index] + "poker"
        // return cc.res[url]
        return url
    },

    //获取结算界面的扑克的spriteFrame
    getCardResResultName: function (params) {
        var url = "poker_result/" + "poker_" + pokerType[params.type - 1] + "_" + valueStr[params.num]
        return url
    },

    //更新sprite的spriteFrame，因为全部加载实在太慢了
    updateSprite: function (sprite, resName, isDelayShow) {
        //isDelayShow更新完纹理再显示
        if (true == isDelayShow) {
            sprite.node.active = false
        }
        if (!cc.res[resName]) {
            cc.loader.loadRes(resName, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    cc.log(err)
                }
                sprite.spriteFrame = spriteFrame
                if (true == isDelayShow) {
                    sprite.node.active = true
                }
                cc.res[resName] = spriteFrame
            })
        } else {
            sprite.spriteFrame = cc.res[resName]
            if (true == isDelayShow) {
                sprite.node.active = true
            }
        }
    },

    //获取挤牌的spriteFrame params{type, num, index, isBack} isBack是否背面
    getJiPaiResName: function (params) {
        var url
        if (params.isBack) {
            url = "threeDCards/kabei.png"
        } 
        else {
            url = "threeDCards/" + pokerType[params.type - 1] + "_" + valueStr[params.num] + ".png"
        }
        return url
    },

    getNumRes: function (params) {
        return "threeDCards/" + pokerType[params.type - 1] + "_" + valueStr[params.num] + "_title.png"
    },

    //加载网络图片
    loadNetUrl: function name(sprite, url, callback) {
        cc.loader.load(url, function (err, texture) {
            if (err) {
                cc.log(err)
            }
            else if(texture instanceof cc.Texture2D){
                sprite.spriteFrame = new cc.SpriteFrame(texture)
                if (callback) {
                    callback()
                }
            }
        })
    },

});
