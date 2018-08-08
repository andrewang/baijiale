"use strict";
cc._RF.push(module, '0e484ZfVmtMy6sReV1IE1ou', 'SmQiangWayItem');
// scripts/app/game/view/WayBill/SmQiangWayItem.js

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