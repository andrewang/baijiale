var BaseMgr = require("BaseMgr")
var self = null

cc.Class({
    extends: BaseMgr,

    properties: {

    },

    onLoad: function () {
        cc.wayBillMgr = this
    },
});
