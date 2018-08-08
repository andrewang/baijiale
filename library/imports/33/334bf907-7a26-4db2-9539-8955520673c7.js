"use strict";
cc._RF.push(module, '334bfkHeiZNspU5iVVSBnPH', 'BaseView');
// scripts/common/base/BaseView.js

"use strict";

var BaseObj = require("BaseObj");
cc.Class({
    extends: BaseObj,

    properties: {
        //模块名字
        moduleName: {
            default: "",
            // type: 'String',
            visible: false
        }
    },

    // ctor: function () {
    //     var Manager = require(this.moduleName+"Mgr")
    //     this.mgr = new Manager(this)
    // },

    onLoad: function onLoad() {
        this._super();
        if (this.moduleName != "") {
            this.mgr = this.node.addComponent(this.moduleName + "Mgr");
            this.mgr.view = this;
        }

        var bg = this.node.getChildByName("bg");
        if (bg) {
            bg.on(cc.Node.EventType.TOUCH_END, function (touch) {
                this.hide();
            }, this);
        }
        var body = this.node.getChildByName("body");
        if (body) {
            body.on(cc.Node.EventType.TOUCH_END, function (touch) {}, this);
        }
    },

    onEnable: function onEnable() {
        this.node.on('touchstart', function (event) {
            event.stopPropagation();
        });
        this.node.on('touchend', function (event) {
            event.stopPropagation();
        });
    },

    onDisable: function onDisable() {
        this.node.off('touchstart', function (event) {
            event.stopPropagation();
        });
        this.node.off('touchend', function (event) {
            event.stopPropagation();
        });
    },

    show: function show() {
        this.node.active = true;
    },

    hide: function hide() {
        this.node.active = false;
    },

    isShow: function isShow() {
        return this.node.active;
    },

    onDestroy: function onDestroy() {
        cc.log("BaseView:onDestroy", this.name);
    }
});

cc._RF.pop();