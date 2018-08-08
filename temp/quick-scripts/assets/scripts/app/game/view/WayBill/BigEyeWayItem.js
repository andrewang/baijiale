(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/game/view/WayBill/BigEyeWayItem.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '19847vAZDlDULoeMM3EqxsU', 'BigEyeWayItem', __filename);
// scripts/app/game/view/WayBill/BigEyeWayItem.js

"use strict";

var BaseObj = require("BaseObj");
cc.Class({
    extends: BaseObj,

    properties: {},

    onLoad: function onLoad() {},

    setData: function setData(data) {
        this.data = data;
        this.find("nodeYes").active = false;
        this.find("nodeNo").active = false;
        if (data) {
            this.find("nodeYes").active = true;
        } else {
            this.find("nodeNo").active = true;
        }
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
        //# sourceMappingURL=BigEyeWayItem.js.map
        