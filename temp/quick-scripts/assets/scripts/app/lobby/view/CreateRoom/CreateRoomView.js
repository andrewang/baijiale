(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/lobby/view/CreateRoom/CreateRoomView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5862eZ8P1JE15i73RfGYZRw', 'CreateRoomView', __filename);
// scripts/app/lobby/view/CreateRoom/CreateRoomView.js

"use strict";

var BaseView = require("BaseView");

cc.Class({
    extends: BaseView,

    properties: {
        moduleName: {
            override: true,
            default: "CreateRoom",
            // type: 'String',
            visible: false
        }

    },

    onLoad: function onLoad() {
        this._super();
    },

    start: function start() {
        this.mgr.loadRuleData();
    },

    show: function show() {
        this._super();
        this.mgr.loadPhpData();
    },

    onCreate: function onCreate() {
        this.mgr.requestCreateRoom();
        this.hide();
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
        //# sourceMappingURL=CreateRoomView.js.map
        