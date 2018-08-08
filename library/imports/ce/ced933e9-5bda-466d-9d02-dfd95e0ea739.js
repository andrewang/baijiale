"use strict";
cc._RF.push(module, 'ced93PpW9pGbZ0C39leDqc5', 'RoomInfoView');
// scripts/app/lobby/view/JoinRoom/RoomInfoView.js

"use strict";

var BaseView = require("BaseView");
var serverRoomDesc = require("JoinRoomConfig").serverRoomDesc;
var Code = require("Code");

cc.Class({
  extends: BaseView,

  properties: {},

  onLoad: function onLoad() {},

  setData: function setData(data) {
    this.data = data;

    var nameString = data.owner_base_info.name;
    if (this.getNameStringCount(nameString) > 10) //最多容纳5个汉字
      {
        nameString = nameString.substr(0, this.getNameStringCount(nameString, 8)) + ".."; //大于5个汉字,取前4个汉子字符加..表示
      }
    this.find("txtName").string = nameString;

    this.find("txtUid").string = i18n.dd_no + "：" + data.owner_base_info.ding_no;
    cc.resMgr.loadNetUrl(this.find("imgIcon"), data.owner_base_info.avatar);

    var room_setup_info = this.data.room_setup_info;
    // this.find("txt1").string = "局数:" + serverRoomDesc["inning_limit_type"][room_setup_info.inning_limit_type]
    this.find("txt1").string = "局数:" + room_setup_info.inning_num;
    this.find("txt2").string = "挤牌:" + serverRoomDesc["squeeze_cards"][room_setup_info.squeeze_cards];
    this.find("txt3").string = serverRoomDesc["midway_join"][room_setup_info.midway_join];
    // this.find("txt4").string = "押注:" + serverRoomDesc["bet_limit_type"][room_setup_info.bet_limit_type]
    this.find("txt4").string = "押注:" + room_setup_info.low_bet + "-" + room_setup_info.hig_bet;
    this.find("txtGroup").node.active = room_setup_info.group_id == 0 ? false : true;
  },

  requestJoin: function requestJoin() {
    cc.sceneNode.js.showLoadingView();
    setTimeout(function () {
      cc.netMgr.request("room_join", { rid: this.data.rid, gid: this.data.room_setup_info.group_id }, function (ret) {
        cc.log("room_join", ret);
        if (ret.code != Code.OK) {
          cc.sceneNode.js.hideLoadingView();
        }
        //在丁丁的其他游戏中
        if (Code.USER_ALREAY_IN_OTHER_GAME == ret.code) {
          cc.common.showMsgBox({ type: 2, msg: "您正在游戏中", okCb: function okCb() {} });
          return;
        }
        cc.netMgr.exec(ret, function () {
          gUserData.roomInfo = ret.room_info;
          cc.director.loadScene("GameScene");
        }.bind(this));
      }.bind(this));
    }.bind(this), 10);
  }
});

cc._RF.pop();