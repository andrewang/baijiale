(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/game/view/WayBill/WayBillData.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd81a61hNVVM6JoYqgLv49lg', 'WayBillData', __filename);
// scripts/app/game/view/WayBill/WayBillData.js

"use strict";

var BigwayData = cc.Class({
    extends: cc.Component,

    properties: {},

    ctor: function ctor() {
        this.lastElement = { row: 0, col: 0 };
        this.matrix = {};
        // for (var i = 1; i <= 6; i++) {
        //     this.matrix[i] = {}
        // }
        this.matrix[1] = {};
    },

    // init: function (array) {
    //     for (var i = 0; i < array.length; i++) {
    //         this.push(clone(array[i]))
    //     }
    // },

    //state_list 数组：1:庄，2:闲，3:和，4:庄对，5:闲对
    push: function push(state_list) {
        var pos = this.getNextPos(this.lastElement.row, this.lastElement.col);
        var row = pos[0];
        var col = pos[1];
        state_list.sort();
        this.matrix[row][col] = state_list;
        this.lastElement.row = row;
        this.lastElement.col = row;
    },

    getNextPos: function getNextPos(row, col) {
        if (0 == row && 0 == col) {
            return [1, 1];
        }
        // if (6 == row) {
        //     return [1, col + 1]
        // }
        return [row + 1, col];
    }
});

module.exports = {
    BigwayData: BigwayData
};

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
        //# sourceMappingURL=WayBillData.js.map
        