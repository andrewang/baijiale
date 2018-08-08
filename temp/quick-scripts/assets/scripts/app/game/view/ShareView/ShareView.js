(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/game/view/ShareView/ShareView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2f2ecGDTQBPMql5rlyBr9oY', 'ShareView', __filename);
// scripts/app/game/view/ShareView/ShareView.js

"use strict";

var BaseView = require("BaseView");
var GameToAppHelper = require("GameToAppHelper");
var imgPath;
cc.Class({
    extends: BaseView,

    properties: {},

    onLoad: function onLoad() {
        this._super();
        if (cc.sys.isNative) {
            imgPath = jsb.fileUtils.getWritablePath() + "jietu.png";
        }
    },

    onInviteFriends: function onInviteFriends() {
        cc.log("微信邀请好友！！！");
        GameToAppHelper.weChatRoomInvite();
    },

    onInviteDDFriends: function onInviteDDFriends() {
        cc.log("丁丁邀请好友！");
        GameToAppHelper.dingdingRoomInvite();
    },

    onShareFriends: function onShareFriends() {
        cc.log("微信分享游戏！");
        GameToAppHelper.shareGameToWeChatFriend();
    },

    onSharePengYouQuan: function onSharePengYouQuan() {
        cc.log("朋友圈分享游戏!");
        GameToAppHelper.shareGameToWeChatMoment();
    },

    onShareDDFriends: function onShareDDFriends() {
        // cc.log("丁丁邀请好友！")
        // GameToAppHelper.dingdingRoomInvite()
    },

    onShareDDPengYouQuan: function onShareDDPengYouQuan() {},

    //微信分享截图
    onWeixinShareImg: function onWeixinShareImg() {
        GameToAppHelper.sharePicToWeChatFriend(imgPath);
    },

    //微信朋友圈分享截图
    onWeixinShareImgPengYouQuan: function onWeixinShareImgPengYouQuan() {
        GameToAppHelper.sharePicToWeChatMoment(imgPath);
    },

    //dd分享截图
    onDDShareImg: function onDDShareImg() {
        GameToAppHelper.sharePicToDingdingFriend(imgPath);
    },

    //dd朋友圈分享截图
    onDDShareImgPengYouQuan: function onDDShareImgPengYouQuan() {
        GameToAppHelper.sharePicToDingdingMoment(imgPath);
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
        //# sourceMappingURL=ShareView.js.map
        