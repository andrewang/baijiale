(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/lobby/view/notice/NoticePopView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c8184dxmmVPRoTkLhmPzGrm', 'NoticePopView', __filename);
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
        //# sourceMappingURL=NoticePopView.js.map
        