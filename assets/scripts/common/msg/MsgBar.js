var BaseObj = require("BaseObj")
cc.Class({
    extends: BaseObj,

    properties: {

    },

    onLoad: function () {
        this._super()
    },

    show: function (msg) {
        this.find("txtContent").string = msg

        this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function () {
            cc.common.popBar()
        }.bind(this))))
    },
});
