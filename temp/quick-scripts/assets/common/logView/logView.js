(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/common/logView/logView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6a9e2qvyIFGfbEWhDX626Ze', 'logView', __filename);
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
        //# sourceMappingURL=logView.js.map
        