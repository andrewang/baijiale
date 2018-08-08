var BaseView = require("BaseView")
var GameToAppHelper = require("GameToAppHelper")
var imgPath
cc.Class({
    extends: BaseView,

    properties: {

    },

    onLoad: function () {
        this._super()
        if (cc.sys.isNative) {
            imgPath = jsb.fileUtils.getWritablePath() + "jietu.png"        
        }
    },

    onInviteFriends: function () {
        cc.log("微信邀请好友！！！")
        GameToAppHelper.weChatRoomInvite()
    },

    onInviteDDFriends: function () {
        cc.log("丁丁邀请好友！")
        GameToAppHelper.dingdingRoomInvite()
    },

    onShareFriends: function () {
        cc.log("微信分享游戏！")
        GameToAppHelper.shareGameToWeChatFriend()
    },

    onSharePengYouQuan: function () {
        cc.log("朋友圈分享游戏!")
        GameToAppHelper.shareGameToWeChatMoment()
    },

    onShareDDFriends: function () {
        // cc.log("丁丁邀请好友！")
        // GameToAppHelper.dingdingRoomInvite()
    },

    onShareDDPengYouQuan: function () {

    },

    //微信分享截图
    onWeixinShareImg: function () {
        GameToAppHelper.sharePicToWeChatFriend(imgPath)
    },

    //微信朋友圈分享截图
    onWeixinShareImgPengYouQuan: function () {
        GameToAppHelper.sharePicToWeChatMoment(imgPath)
    },

    //dd分享截图
    onDDShareImg: function () {
        GameToAppHelper.sharePicToDingdingFriend(imgPath)
    },

    //dd朋友圈分享截图
    onDDShareImgPengYouQuan: function () {
        GameToAppHelper.sharePicToDingdingMoment(imgPath)
    },

});
