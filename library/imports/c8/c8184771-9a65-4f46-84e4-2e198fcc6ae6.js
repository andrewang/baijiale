"use strict";
cc._RF.push(module, 'c8184dxmmVPRoTkLhmPzGrm', 'NoticePopView');
// scripts/app/lobby/view/notice/NoticePopView.js

"use strict";

var BaseView = require("BaseView");

cc.Class({
    extends: BaseView,

    properties: {},

    onLoad: function onLoad() {
        this._super();
    },

    setData: function setData(data) {
        this.data = data;
        this.find("txtTitle").string = data.title;
        cc.resMgr.loadNetUrl(this.find("imgContent"), data.content);
    },

    show: function show() {
        this._super();
    },

    hide: function hide() {
        this._super();
    }

});

cc._RF.pop();