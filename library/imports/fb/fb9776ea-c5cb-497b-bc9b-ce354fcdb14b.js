"use strict";
cc._RF.push(module, 'fb977bqxctJe7ybzjVPzbFL', 'WayBillMgr');
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