"use strict";
cc._RF.push(module, '6cc3cgXdV1DYaiBUyU94nDu', 'SmallWayItem');
// scripts/app/game/view/WayBill/SmallWayItem.js

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