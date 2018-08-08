(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/common/eventMgr/EventMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fbea06g/FJL6K+CCRUhuIaP', 'EventMgr', __filename);
// scripts/common/eventMgr/EventMgr.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    // use this for initialization
    ctor: function ctor() {
        this.eventMap = {};
    },

    addEvent: function addEvent(name, cb, obj) {
        var arr = this.eventMap[name];
        if (null == arr) {
            arr = [];
            this.eventMap[name] = arr;
        }
        arr.push({ name: name, cb: cb, obj: obj });
    },

    removeEvent: function removeEvent(name, cb) {
        var arr = this.eventMap[name];
        if (null == arr) {
            return;
        }
        for (var key in arr) {
            var v = arr[key];
            if (cb == v.cb) {
                // delete arr[key]
                arr.splice(key, 1);
                return;
            }
        }
    },

    emit: function emit(name, data) {
        var arr = this.eventMap[name];
        // cc.log("...", arr)
        if (null == arr) {
            return;
        }
        for (var key in arr) {
            var v = arr[key];
            // v.cb(data)
            v.cb.call(v.obj, data);
        }
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
        //# sourceMappingURL=EventMgr.js.map
        