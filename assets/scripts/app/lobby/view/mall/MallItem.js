var BaseObj = require("BaseObj")
var http = require("Http")
var Code = require("Code")
var GameToAppHelper = require("GameToAppHelper")
var enumType = {
    diamond : 1,
    roomCard : 2,
}

cc.Class({
    extends: BaseObj,

    properties: {

    },

    onLoad: function () {
        this.diamondSprite = this.find("diamondSprite")
        this.diamondNumLabel = this.find("diamondNumLabel")
        this.presentDiamondLabel = this.find("presentDiamondLabel")
        this.presentBg = this.find("presentBg")
        this.rmbLabel = this.find("rmbLabel")
    },

    init: function (param) {
        this.itemNumber = param.number
        this.MallView = param.MallView
    },
    /*
        id	int	
        name	string	名称
        amount	int	数量
        type	int	渠道类型：1苹果;2安卓
        money	string	金额
        flag	int	钻石类型1:原价,2:优惠
        status	int	状态0失效1正常
        sort	int	排序
        give_amount	int	赠送数量(为0表示没有赠送)
        give_starttime	int	赠送开始时间
        give_endtime int	赠送结束时间
        isgive	int	是否赠送0否1是
        created_at	int	创建时间
        display	int	 是否删除0删除1未删除
        discount string	代理价
    */
    setData: function (data) {
        this.data = data
        // this.diamondNumLabel.string = data.diamondNum + "个钻石"
        this.diamondNumLabel.string = data.name
        // this.rmbLabel.string = "¥" + data.rmb
        // var curTime = Date.parse(new Date()) / 1000
        if (enumType.diamond == this.type) { //钻石item
            this.diamondSprite.spriteFrame = this.MallView.getDiamondImages(this.itemNumber)
            this.rmbLabel.string = "¥" + data.money
            if (data.is_give == 0) {
                this.presentBg.active = false
                return
            }
            this.presentDiamondLabel.string = "赠送" + data.give_amount + "颗钻石"
            this.presentBg.active = true
        }
        else if (enumType.roomCard == this.type) { //房卡
            this.rmbLabel.string = "¥" + data.diamond
            if (data.is_give == 0) {
                this.presentBg.active = false
                return
            }
            this.presentDiamondLabel.string = "赠送" + data.give_amount + "张房卡"
            this.presentBg.active = true
        }
    },

    onBuyButton: function () {
        cc.log("---onBuyButton---" + this.itemNumber)
        if (enumType.diamond == this.type) {
            this.MallView.pay.active = true
            this.MallView.pay.js.setData(this.data)
        }
        else if (enumType.roomCard == this.type) {
            var str = "是否使用" + this.data.diamond + "钻石兑换" + this.data.amount + "张房卡"
            if (this.data.is_give == 1) {
                str = str + "\n再赠送" + this.data.give_amount + "张房卡"
            }
            cc.common.showMsgBox({
                type: 2, msg: str, okCb: function () {
                    this.requestBuyRoomCard()
                }.bind(this),
                cancleCb: function () {

                }.bind(this),
            })
        }
    },

    //购买房卡
    requestBuyRoomCard: function () {
        var t = 1
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            t = 2
        }
        http.sendRequest("/game/exchange", {user_id : gUserData.uid, exchange_id : this.data.id, updated_at : this.data.updated_at, system : t}, function (ret, status) {
            cc.log(ret)
            if (Code.ERROR_CONFIG_NOT_FOUND == ret.code) {
                cc.common.showMsgBox({type: 2, msg: "配置未找到", okCb: function () {
                    
                }})
            }
            else if (400 == ret.code) {
                cc.common.showMsgBox({
                    type: 2, msg: "钻石不足", okCb: function () {
                        
                    }.bind(this),
                })
            }
            else if (Code.ROOM_CARD_CONFIG_CHANGE == ret.code) {
                cc.common.showMsgBox({type: 2, msg: "配置不一致，请重启游戏", okCb: function () {
                    GameToAppHelper.ExitGame()
                }})
            }
            else {
                cc.common.showMsgBox({ type: 1, msg: "兑换成功" })
                cc.eventMgr.emit("updatePlayerInfo")
            }
        }.bind(this))
    }
});
