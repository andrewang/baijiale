(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/lobby/view/JoinRoom/JoinRoomMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '71561XZBkpCLY3KvAqQ02Is', 'JoinRoomMgr', __filename);
// scripts/app/lobby/view/JoinRoom/JoinRoomMgr.js

"use strict";

var BaseMgr = require("BaseMgr");
var ruleMap = require("CreateRoomConfig").ruleMap;
var Code = require("Code");

cc.Class({
  extends: BaseMgr,

  properties: {},

  // ctor: function () {
  //   cc.log("ctor")
  //   this.view = arguments[0]
  //   cc.eventMgr.addEvent("test", function (event) {
  //     cc.log("test", event)
  // })
  // },

  onLoad: function onLoad() {
    this._super();

    cc.log("JoinRoom:onLoad");
    this.view = arguments[0];
    this.cb = function (event) {
      cc.log("test", event);
    };
    cc.eventMgr.addEvent("test", this.cb);
  },

  requestJoin: function requestJoin(rid) {
    cc.sceneNode.js.showLoadingView();
    setTimeout(function () {
      var groupId = 0;
      if (gUserData.dingdingData.gameData) {
        groupId = gUserData.dingdingData.gameData.groupId;
      }
      cc.netMgr.request("room_join", { rid: rid, gid: 0 }, function (ret) {
        cc.log("room_join", ret);
        if (ret.code != Code.OK) {
          cc.sceneNode.js.hideLoadingView();
        }
        cc.netMgr.exec(ret, function () {
          gUserData.roomInfo = ret.room_info;
          cc.director.loadScene("GameScene");
        }.bind(this));
      }.bind(this));
    }.bind(this), 10);
  },

  onDestroy: function onDestroy() {
    this._super();
    cc.eventMgr.removeEvent("test", this.cb);
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
        //# sourceMappingURL=JoinRoomMgr.js.map
        