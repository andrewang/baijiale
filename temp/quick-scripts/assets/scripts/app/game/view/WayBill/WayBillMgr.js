(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/game/view/WayBill/WayBillMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fb977bqxctJe7ybzjVPzbFL', 'WayBillMgr', __filename);
// scripts/app/game/view/WayBill/WayBillMgr.js

"use strict";

var BaseMgr = require("BaseMgr");
var self = null;

cc.Class({
    extends: BaseMgr,

    properties: {},

    onLoad: function onLoad() {
        cc.wayBillMgr = this;
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
        //# sourceMappingURL=WayBillMgr.js.map
        