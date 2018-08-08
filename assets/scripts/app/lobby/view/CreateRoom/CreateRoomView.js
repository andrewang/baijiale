var BaseView = require("BaseView")
var GameToAppHelper = require("GameToAppHelper")

cc.Class({
    extends: BaseView,

    properties: {
        moduleName : {
            override: true,
            default: "CreateRoom",
            // type: 'String',
            visible: false,
        },
        
    },

    onLoad: function () {
        this._super()
        this.mgr.loadRuleData()
        this.mgr.loadPhpData()
    },

    start: function () {
        
    },

    show: function () {
        this._super()
        this.mgr.isSendRequest = false
    },

    onCreate: function () {
        this.mgr.checkForbidGame(function () {
            cc.common.showMsgBox({
                type: 2, msg: "游戏停止运营", okCb: function () {
                    GameToAppHelper.ExitGame()
                }
            })
        }.bind(this), function () {
            // this.hide()
            cc.log("点击")
            this.mgr.requestCreateRoom()
            this.hide()
        }.bind(this))
    },
});
