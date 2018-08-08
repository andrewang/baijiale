"use strict";
cc._RF.push(module, '69fa9HaL25JioUzgZvriNFV', 'MallPay');
// scripts/app/lobby/view/mall/MallPay.js

"use strict";

var BaseObj = require("BaseObj");
var GameToAppHelper = require("GameToAppHelper");
cc.Class({
    extends: BaseObj,

    properties: {},

    onLoad: function onLoad() {},

    onWechatPay: function onWechatPay() {
        // cc.log("onWechatPay" + "  支付：" + this.data.rmb + "  获得：" + this.data.itemNumber)  
        GameToAppHelper.executeRecharge(this.data, "wechatpay", "");
    },

    onTreasurePay: function onTreasurePay() {
        // cc.log("onTreasurePay" + "  支付：" + this.data.rmb + "  获得：" + this.data.itemNumber)
        GameToAppHelper.executeRecharge(this.data, "alipay", "");
    },

    onApplePay: function onApplePay() {
        // cc.log("onApplePay" + "  支付：" + this.data.rmb + "  获得：" + this.data.itemNumber)
        GameToAppHelper.executeRecharge(this.data, "applepay", "");
    },

    hide: function hide() {
        this.node.active = false;
    },

    setData: function setData(data) {
        this.data = data;
    }
});

cc._RF.pop();