var BaseView = require("BaseView")
var ChatConfig = require("ChatConfig")

cc.Class({
    extends: BaseView,

    properties: {
        
    },

    onLoad: function () {
        this._super()
        this.setData()
    },

    setData: function (data) {
        cc.log("xxx", this.find("sliderMusic").getComponent(cc.Slider).progress)
        cc.log(this.find("toggle1").getComponent(cc.Toggle).isChecked)
    },

    onMusicProgressChanged: function (sender) {
        cc.log(sender.progress)
        this.musicVolume = sender.progress
        cc.musicMgr.setMusicVolume(this.musicVolume)
        this.find("proMusic").getComponent(cc.ProgressBar).progress = sender.progress
    },

    onEffectProgressChanged: function (sender) {
        this.effectVolume = sender.progress
        cc.musicMgr.setEffectVolume(this.effectVolume)
        this.find("proEffect").getComponent(cc.ProgressBar).progress = sender.progress
    },

    onBtnDismiss: function () {
        cc.gameMgr.reqRoomClose()
    },

    show: function () {
        this._super()
        this.effectVolume = cc.musicMgr.getEffectVolume()
        this.find("sliderEffect").getComponent(cc.Slider).progress = this.effectVolume
        this.musicVolume = cc.musicMgr.getMusicVolume()
        this.find("sliderMusic").getComponent(cc.Slider).progress = this.musicVolume

        this.find("proMusic").getComponent(cc.ProgressBar).progress = this.find("sliderMusic").getComponent(cc.Slider).progress
        this.find("proEffect").getComponent(cc.ProgressBar).progress = this.find("sliderEffect").getComponent(cc.Slider).progress

        for(let i = 1; i < 5; i++)
        {
            if (Number(ChatConfig.chatStage) == i)
            {
                this.find("toggle" + i).getComponent(cc.Toggle).isChecked = true
            }
            else
            {
                this.find("toggle" + i).getComponent(cc.Toggle).isChecked = false
            }
            cc.log("toggle" + i + this.find("toggle" + i).getComponent(cc.Toggle).isChecked)
        }
    },

    hide: function () {
        this._super()
        // cc.musicMgr.setEffectVolume(this.effectVolume)
        // cc.musicMgr.setMusicVolume(this.musicVolume)
        cc.musicMgr.saveEffectVolume(this.effectVolume)
        cc.musicMgr.saveMusicVolume(this.musicVolume)
    },
    
    onToggleEvent: function (toggle, customEventData){
        cc.log("toggleName: ", toggle.name, "customEventData: ", customEventData)
        ChatConfig.chatStage = customEventData
    }
});
