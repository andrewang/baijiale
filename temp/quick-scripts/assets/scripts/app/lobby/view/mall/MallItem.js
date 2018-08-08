(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/lobby/view/mall/MallItem.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '89434SeICdI2rU5ald0Nmi0', 'MallItem', __filename);
// scripts/app/lobby/view/mall/MallItem.js

"use strict";

var BaseObj = require("BaseObj");
var http = require("Http");
var enumType = {
    diamond: 1,
    roomCard: 2
};

cc.Class({
    extends: BaseObj,

    properties: {},

    onLoad: function onLoad() {
        this.diamondSprite = this.find("diamondSprite");
        this.diamondNumLabel = this.find("diamondNumLabel");
        this.presentDiamondLabel = this.find("presentDiamondLabel");
        this.presentBg = this.find("presentBg");
        this.rmbLabel = this.find("rmbLabel");
    },

    init: function init(param) {
        this.itemNumber = param.number;
        this.MallView = param.MallView;
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
    setData: function setData(data) {
        this.data = data;
        // this.diamondNumLabel.string = data.diamondNum + "个钻石"
        this.diamondNumLabel.string = data.name;
        // this.rmbLabel.string = "¥" + data.rmb

        if (enumType.diamond == this.type) {
            //钻石item
            this.diamondSprite.spriteFrame = this.MallView.getDiamondImages(this.itemNumber);
            this.rmbLabel.string = "¥" + data.money;
            if (data.give_amount == 0) {
                this.presentBg.active = false;
                return;
            }
            this.presentDiamondLabel.string = "赠送" + data.give_amount + "颗钻石";
            this.presentBg.active = true;
        } else if (enumType.roomCard == this.type) {
            //房卡
            this.rmbLabel.string = "¥" + data.diamond;
            this.presentBg.active = false;
        }
    },

    onBuyButton: function onBuyButton() {
        cc.log("---onBuyButton---" + this.itemNumber);
        if (enumType.diamond == this.type) {
            this.MallView.pay.active = true;
            this.MallView.pay.js.setData(this.data);
        } else if (enumType.roomCard == this.type) {
            this.requestBuyRoomCard();
        }
    },

    //购买房卡
    requestBuyRoomCard: function requestBuyRoomCard() {
        http.sendRequest("/game/exchange", { user_id: gUserData.uid, exchange_id: this.data.id }, function (ret, status) {
            cc.log(ret);
            cc.eventMgr.emit("updatePlayerInfo");
        }.bind(this));
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=MallItem.js.map
        