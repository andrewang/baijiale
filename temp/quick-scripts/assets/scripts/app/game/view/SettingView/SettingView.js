(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/game/view/SettingView/SettingView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '33967+j/tRGu6LI2Twilcx7', 'SettingView', __filename);
// scripts/app/game/view/SettingView/SettingView.js

"use strict";

var BaseView = require("BaseView");
var ChatConfig = require("ChatConfig");

cc.Class({
    extends: BaseView,

    properties: {},

    onLoad: function onLoad() {
        this._super();
        this.setData();
    },

    setData: function setData(data) {
        cc.log("xxx", this.find("sliderMusic").getComponent(cc.Slider).progress);
        cc.log(this.find("toggle1").getComponent(cc.Toggle).isChecked);
    },

    onMusicProgressChanged: function onMusicProgressChanged(sender) {
        cc.log(sender.progress);
        this.musicVolume = sender.progress;
        cc.musicMgr.setMusicVolume(this.musicVolume);
        this.find("proMusic").getComponent(cc.ProgressBar).progress = sender.progress;
    },

    onEffectProgressChanged: function onEffectProgressChanged(sender) {
        this.effectVolume = sender.progress;
        cc.musicMgr.setEffectVolume(this.effectVolume);
        this.find("proEffect").getComponent(cc.ProgressBar).progress = sender.progress;
    },

    onBtnDismiss: function onBtnDismiss() {
        cc.gameMgr.reqRoomClose();
    },

    show: function show() {
        this._super();
        this.effectVolume = cc.musicMgr.getEffectVolume();
        this.find("sliderEffect").getComponent(cc.Slider).progress = this.effectVolume;
        this.musicVolume = cc.musicMgr.getMusicVolume();
        this.find("sliderMusic").getComponent(cc.Slider).progress = this.musicVolume;

        this.find("proMusic").getComponent(cc.ProgressBar).progress = this.find("sliderMusic").getComponent(cc.Slider).progress;
        this.find("proEffect").getComponent(cc.ProgressBar).progress = this.find("sliderEffect").getComponent(cc.Slider).progress;

        for (var i = 1; i < 5; i++) {
            if (Number(ChatConfig.chatStage) == i) {
                this.find("toggle" + i).getComponent(cc.Toggle).isChecked = true;
            } else {
                this.find("toggle" + i).getComponent(cc.Toggle).isChecked = false;
            }
            cc.log("toggle" + i + this.find("toggle" + i).getComponent(cc.Toggle).isChecked);
        }
    },

    hide: function hide() {
        this._super
        // cc.musicMgr.setEffectVolume(this.effectVolume)
        // cc.musicMgr.setMusicVolume(this.musicVolume)
        ();cc.musicMgr.saveEffectVolume(this.effectVolume);
        cc.musicMgr.saveMusicVolume(this.musicVolume);
    },

    onToggleEvent: function onToggleEvent(toggle, customEventData) {
        cc.log("toggleName: ", toggle.name, "customEventData: ", customEventData);
        ChatConfig.chatStage = customEventData;
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
        //# sourceMappingURL=SettingView.js.map
        