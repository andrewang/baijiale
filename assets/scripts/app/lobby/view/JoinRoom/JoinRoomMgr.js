var BaseMgr = require("BaseMgr")
var ruleMap = require("CreateRoomConfig").ruleMap
var Code = require("Code")
var http = require("Http")

cc.Class({
  extends: BaseMgr,

  properties: {

  },

  // ctor: function () {
  //   cc.log("ctor")
  //   this.view = arguments[0]
  //   cc.eventMgr.addEvent("test", function (event) {
  //     cc.log("test", event)
  // })
  // },

  onLoad: function () {
    this._super()

    cc.log("JoinRoom:onLoad")
    this.view = arguments[0]
    this.cb = function (event) {
      cc.log("test", event)
    }
    cc.eventMgr.addEvent("test", this.cb)
  },

  requestJoin: function (rid) {
    cc.sceneNode.js.showLoadingView()
    setTimeout(function () {
      var groupId = 0
      if (gUserData.dingdingData.gameData) {
        groupId = gUserData.dingdingData.gameData.groupId
      }
      cc.netMgr.request("room_join", { rid: rid, gid : 0}, function (ret) {
        cc.log("room_join", ret);
        if (ret.code != Code.OK) {
          cc.sceneNode.js.hideLoadingView()
        }
        cc.netMgr.exec(ret, function () {
          gUserData.roomInfo = ret.room_info
          cc.director.loadScene("GameScene")
        }.bind(this))
      }.bind(this))
    }.bind(this), 10)
  },

  onDestroy: function () {
    this._super()
    cc.eventMgr.removeEvent("test", this.cb)
  },

  //检查屏蔽游戏，两个平台都屏蔽时，不能游戏
  checkForbidGame: function (forbidCb, normalCb) {
    //IOS
    http.sendRequest("/game/fetch_shields", { system: 1 }, function (ret, status) {
        cc.log(ret)
        if (1 == ret.data.disGame_baijiale) {
            normalCb()
            return false
        }
        //android
        http.sendRequest("/game/fetch_shields", { system: 2 }, function (ret, status) {
            cc.log(ret)
            if (1 == ret.data.disGame_baijiale) {
                normalCb()
                return false
            }
            else {
                forbidCb()
                return true;
            }
        }.bind(this))
    }.bind(this))
},

});
