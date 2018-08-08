var BaseObj = require("BaseObj")
var GameToAppHelper = require("GameToAppHelper")
cc.Class({
    extends: BaseObj,

    properties: {

    },

    onLoad: function () {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            this.find("applePayNode").active = false
        }
        else {
            this.find("applePayNode").active = 1 == gUserData.forbidSetting.disDiamond_originalRecharge_applePayment
        }
        this.find("wechatPayNode").active = 1 == gUserData.forbidSetting.disDiamond_originalRecharge_weChatPayment
        this.find("treasurePayNode").active = 1 == gUserData.forbidSetting.disDiamond_originalRecharge_alipayPayment
    },

    onWechatPay: function () {
        // cc.log("onWechatPay" + "  支付：" + this.data.rmb + "  获得：" + this.data.itemNumber, this.data.give_amount)  
        GameToAppHelper.executeRecharge(this.data, "wechatpay", "")
    },

    onTreasurePay: function () {
        // cc.log("onTreasurePay" + "  支付：" + this.data.rmb + "  获得：" + this.data.itemNumber)
        GameToAppHelper.executeRecharge(this.data, "alipay", "")
    },

    onApplePay: function () {
        // cc.log("onApplePay" + "  支付：" + this.data.rmb + "  获得：" + this.data.itemNumber)
        GameToAppHelper.executeRecharge(this.data, "applepay", "")
    },

    hide: function () {
        this.node.active = false
    },

    setData: function (data) {
        this.data = data
    }
});
