var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
        
    },

    onLoad: function () {
        this._super()
    },

    show: function () {
        this._super()
        var LogMgr = require("LogMgr")
        this.find("str").string = LogMgr.logStr
        // console.log("111", LogMgr.logStr)
    }

});
