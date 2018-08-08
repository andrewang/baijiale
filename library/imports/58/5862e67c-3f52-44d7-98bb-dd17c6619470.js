"use strict";
cc._RF.push(module, '5862eZ8P1JE15i73RfGYZRw', 'CreateRoomView');
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