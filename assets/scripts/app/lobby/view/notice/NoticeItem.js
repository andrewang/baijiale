var BaseObj = require("BaseObj")
cc.Class({
    extends: BaseObj,

    properties: {
        
    },

    onLoad: function () {
        
    },

    setData: function (data) {
        this.data = data
        this.find("txtContent").string = data.title
    },

    click: function () {
        cc.eventMgr.emit("selectNoticeItem", this.data)
    },

});
