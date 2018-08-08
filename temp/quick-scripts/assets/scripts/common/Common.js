(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/common/Common.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '79d3fLr9m5CZ6IMCKt1F/0e', 'Common', __filename);
// scripts/common/Common.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // msgBarPrefab: cc.Prefab,
        // msgBoxPrefab: cc.Prefab,
        // msgbarList: []
    },

    onLoad: function onLoad() {},

    init: function init() {
        var self = this;
        this.msgBoxUrl = "prefabs/msgBox/MsgBox";
        this.msgBarUrl = "prefabs/msgBox/MsgBar";
        this.msgbarList = [];
        function loadPrefab(url) {
            cc.loader.loadRes(url, function (err, prefab) {
                self[url] = prefab;
            });
        }
        loadPrefab(this.msgBoxUrl);
        loadPrefab(this.msgBarUrl);
    },

    //param: {type : 1, msg : "", cb}
    showMsgBox: function showMsgBox(params) {
        if (1 == params.type) {
            if (this[this.msgBarUrl]) {
                var msgBar = cc.instantiate(this[this.msgBarUrl]);
                msgBar.parent = cc.gNode;
                if (params.codeNumber) {
                    msgBar.codeNumber = params.codeNumber;
                } else {
                    msgBar.codeNumber = -1;
                }
                msgBar.js.show(params.msg);
                this.msgbarList.push(msgBar);
                if (this.msgbarList.length > 5) {
                    this.popBar();
                }
                this.adjustBar();
            } else {
                cc.loader.loadRes(this.msgBarUrl, function (err, prefab) {
                    var msgBar = cc.instantiate(prefab);
                    msgBar.parent = cc.gNode;
                    if (params.codeNumber) {
                        msgBar.codeNumber = params.codeNumber;
                    } else {
                        msgBar.codeNumber = -1;
                    }
                    msgBar.js.show(params.msg);
                    this.msgbarList.push(msgBar);
                    if (this.msgbarList.length > 5) {
                        this.popBar();
                    }
                    this.adjustBar();
                }.bind(this));
            }
        } else if (2 == params.type) {
            if (this[this.msgBoxUrl]) {
                if (!this.msgBox) {
                    //msgbox只存在一个，如再有生成只刷新内容
                    this.msgBox = cc.instantiate(this[this.msgBoxUrl]);
                    this.msgBox.parent = cc.gNode;
                }
                this.msgBox.js.setData(params);
            } else {
                cc.loader.loadRes(this.msgBoxUrl, function (err, prefab) {
                    if (!this.msgBox) {
                        this.msgBox = cc.instantiate(this[this.msgBoxUrl]);
                        this.msgBox.parent = cc.gNode;
                    }
                    msgBox.js.setData(params);
                }.bind(this));
            }
        }
    },

    //移除一个消息条
    popBar: function popBar() {
        if (this.msgbarList.length > 0) {
            this.msgbarList[0].js.node.destroy();
            removeByIndex(this.msgbarList, 0);
        }
    },

    adjustBar: function adjustBar() {
        for (var i = 0; i < this.msgbarList.length; i++) {
            this.msgbarList[i].js.node.position = { x: 0, y: 80 * (this.msgbarList.length - i - 1) };
        }
    },

    //是否有重复提示
    isRepetitionBar: function isRepetitionBar(codeNumber) {
        for (var i = 0; i < this.msgbarList.length; i++) {
            if (this.msgbarList[i].codeNumber == codeNumber) {
                return true;
            }
        }
        return false;
    },

    //同步清除msgBox
    clearMsgBox: function clearMsgBox() {
        this.msgBox = null;
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
        //# sourceMappingURL=Common.js.map
        