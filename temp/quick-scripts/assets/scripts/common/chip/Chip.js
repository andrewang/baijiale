(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/common/chip/Chip.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9a9e2o+YbdAbJzPSx4aXB2E', 'Chip', __filename);
// scripts/common/chip/Chip.js

// var BaseObj = require("BaseObj")
// cc.Class({
//     extends: BaseObj,

//     properties: {
//         value : 0,
//     },

//     onLoad: function () {
//         this._super()

//         this.init()
//     },

//     init: function () {
//         this.find("nodeSelected").node.active = false
//         //一开始游戏选择第一个筹码
//         if ("chip1" == this.node._name) {
//             this.find("nodeSelected").node.active = true
//         }

//         var self = this
//         this.node.on(cc.Node.EventType.TOUCH_END, function (touch) {
//             cc.gameMgr.view.unSelectAllChip()
//             self.setSelect(true)
//         }, this);
//     },

//     setData: function (value) {
//         this.value = value
//         this.find("imgBg").spriteFrame = cc.res["chip/chip_" + value]
//         this.find("txtNum").string = value
//     },

//     setSelect: function (bSelect) {
//         this.find("nodeSelected").node.active = bSelect
//     },

//     isSelect: function () {
//         return this.find("nodeSelected").node.active
//     }
// });
"use strict";

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
        //# sourceMappingURL=Chip.js.map
        