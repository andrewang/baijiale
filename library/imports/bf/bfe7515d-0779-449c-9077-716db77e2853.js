"use strict";
cc._RF.push(module, 'bfe75FdB3lEnJB3cW23fihT', 'NoticeItem');
// scripts/app/lobby/view/notice/NoticeItem.js

"use strict";

var BaseObj = require("BaseObj");
cc.Class({
    extends: BaseObj,

    properties: {},

    onLoad: function onLoad() {},

    setData: function setData(data) {
        this.data = data;
        this.find("txtContent").string = data.title;
    },

    click: function click() {
        cc.eventMgr.emit("selectNoticeItem", this.data);
    }

});

cc._RF.pop();