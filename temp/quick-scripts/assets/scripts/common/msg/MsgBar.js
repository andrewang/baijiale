(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/common/msg/MsgBar.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f6622+GOUdIQ5ggvmBqC7aj', 'MsgBar', __filename);
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
        //# sourceMappingURL=MsgBar.js.map
        