(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/common/msg/MsgBox.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1767fiAb7hHc6Wof8zPkwY/', 'MsgBox', __filename);
// scripts/common/msg/MsgBox.js

"use strict";

var BaseView = require("BaseView");
cc.Class({
    extends: BaseView,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        var bg = this.node.getChildByName("bg");
        if (bg) {
            //MSBOX这里点击背景需要销毁，如果只是hide，会有奇怪的BUG，（进游戏点击两次解散房间，第一次点击背景调用hide，第二次退回到大厅，会发现
            //这个监听还在，但是this.node.active已经为false）暂时还不清楚什么原因
            bg.on(cc.Node.EventType.TOUCH_END, function (touch) {
                this.onBtnCancel(); //点击背景同等与点击取消按钮
                //this.node.destroy()
            }, this);
        }

        this.btnCancel = this.find("btnCancel");
        this.btnOk = this.find("btnOk");
        this.btnChongZhi = this.find("btnChongZhi");
        this.txtContent = this.find("txtContent");
    },

    setData: function setData(params) {
        this.txtContent.string = params.msg;
        this.okCb = params.okCb;
        this.cancleCb = params.cancleCb;
        if (this.cancleCb) {
            this.btnCancel.active = true;
        } else {
            this.btnCancel.active = false;
            if (!params.chongZhi) this.cancleCb = params.okCb; //如果只剩下确定按钮时，点击背景也是确定。不然解散房间会出现BUG
        }
        if (params.chongZhi) {
            this.btnOk.active = false;
            this.btnChongZhi.active = true;
            this.btnCancel.active = true;
        } else {
            this.btnOk.active = true;
            this.btnChongZhi.active = false;
        }
    },

    onBtnOk: function onBtnOk() {
        if (this.okCb) {
            this.okCb();
        }
        this.node.destroy();
        cc.common.clearMsgBox();
        // this.hide()
    },

    onBtnCancel: function onBtnCancel() {
        if (this.cancleCb) {
            this.cancleCb();
        }
        this.node.destroy();
        cc.common.clearMsgBox();
        // this.hide()
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
        //# sourceMappingURL=MsgBox.js.map
        