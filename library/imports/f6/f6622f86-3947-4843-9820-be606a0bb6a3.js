"use strict";
cc._RF.push(module, 'f6622+GOUdIQ5ggvmBqC7aj', 'MsgBar');
// scripts/common/msg/MsgBar.js

"use strict";

var BaseObj = require("BaseObj");
cc.Class({
    extends: BaseObj,

    properties: {},

    onLoad: function onLoad() {
        this._super();
    },

    show: function show(msg) {
        this.find("txtContent").string = msg;

        this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function () {
            cc.common.popBar();
        }.bind(this))));
    }
});

cc._RF.pop();