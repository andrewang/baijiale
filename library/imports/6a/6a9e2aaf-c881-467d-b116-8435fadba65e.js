"use strict";
cc._RF.push(module, '6a9e2qvyIFGfbEWhDX626Ze', 'logView');
// common/logView/logView.js

"use strict";

var BaseView = require("BaseView");
cc.Class({
    extends: BaseView,

    properties: {},

    onLoad: function onLoad() {
        this._super();
    },

    show: function show() {
        this._super();
        var LogMgr = require("LogMgr");
        this.find("str").string = LogMgr.logStr;
        // console.log("111", LogMgr.logStr)
    }

});

cc._RF.pop();