(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/game/view/BattleRecord/TotalBattleRecordItem.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '428f97GY55Lk4WAndi4Qpbk', 'TotalBattleRecordItem', __filename);
// scripts/app/game/view/BattleRecord/TotalBattleRecordItem.js

"use strict";

var BaseObj = require("BaseObj");
var serverRoomDesc = require("JoinRoomConfig").serverRoomDesc;
var http = require("Http");
cc.Class({
    extends: BaseObj,

    properties: {},

    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            var prent = cc.sceneNode.js.find("singleBattleRecordNode");
            var view = cc.sceneNode.js.openView("prefabs/battleRecord/SingleBattleRecordView", prent ? prent.node : null);
            // view.owner_uid = this.data.owner_uid
            view.owner_base_info = this.data.owner_base_info;
            view.seat_info_list = this.data.seat_info_list;
            view.setData(this.data);
            view.reqGameRecord(this.data.rid);
        }, this);
    },

    setPoint: function setPoint(txt, point) {
        if (point >= 0) {
            point = parseFloat(point);
            txt.node.color = cc.Color.WHITE.fromHEX("#6DCFF6");
            txt.string = "+" + point;
        } else {
            point = Math.abs(point);
            point = parseFloat(point);
            txt.node.color = cc.Color.WHITE.fromHEX("#ED1C24");
            txt.string = "-" + point;
        }
    },

    //data:room_record_info
    setData: function setData(data) {
        this.data = data;
        this.find("txtRoomId").string = "房间号:" + data.room_num;
        // this.find("txtYazhu").string = "最低-最高:" + serverRoomDesc["bet_limit_type"][data.bet_limit_type]
        this.find("txtYazhu").string = data.low_bet + "-" + data.hig_bet;
        // this.find("txtJushu").string = "局数:" + serverRoomDesc["inning_limit_type"][data.inning_limit_type]
        this.find("txtJushu").string = "局数:" + data.max_inning_num;
        var newDate = new Date();
        newDate.setTime(data.open_room_time * 1000);
        // this.find("txtTime").string = newDate.toLocaleString()
        this.find("txtTime").string = formatDate(newDate);
        var owner = this.find("owner").node;
        // owner.txtName.string = data.owner_uid

        var nameString = data.owner_base_info.name;
        if (this.getNameStringCount(nameString) > 10) {
            nameString = nameString.substr(0, this.getNameStringCount(nameString, 8)) + "..";
        }
        owner.txtName.string = nameString;

        // owner.txtPoint.string = data.owner_win_total
        // owner.txtPoint.string = data.owner_profix.win_jetton
        this.setPoint(owner.txtPoint, data.owner_profix.win_jetton);
        // cc.resMgr.loadNetUrl(owner.imgIcon, data.owner_base_info.avatar)
        cc.resMgr.loadNetUrl(this.find("owner").find("imgIcon"), data.owner_base_info.avatar);

        for (var i = 1; i <= 9; i++) {
            var player = this.find("player" + i);
            player.node.active = false;
        }

        function getSeatInfo(uid) {
            for (var i = 0; i < data.seat_info_list.length; i++) {
                if (data.seat_info_list[i].user_base_info.uid == uid) {
                    return data.seat_info_list[i];
                }
            }
        }

        data.user_profix_list.sort(function (a, b) {
            return a.uid - b.uid;
        });

        for (var i = 0; i < data.user_profix_list.length; i++) {
            var user_profit = data.user_profix_list[i];
            var player = this.find("player" + (i + 1));
            player.node.active = true;
            player.node.nodeOwner.node.active = false;
            // player.node.txtName.string = user_profit.uid
            var seatInfo = getSeatInfo(user_profit.uid);

            var nameString = seatInfo.user_base_info.name;
            if (this.getNameStringCount(nameString) > 10) {
                nameString = nameString.substr(0, this.getNameStringCount(nameString, 8)) + "..";
            }
            player.node.txtName.string = nameString;

            // player.node.txtPoint.string = user_profit.win_jetton
            this.setPoint(player.node.txtPoint, user_profit.win_jetton);
            // cc.resMgr.loadNetUrl(player.node.imgIcon, seatInfo.user_base_info.avatar)
            cc.resMgr.loadNetUrl(player.find("imgIcon"), seatInfo.user_base_info.avatar);
        }

        this.showMyselfBg();

        //这里根据人数改变item的大小
        // if (data.user_profix_list.length <= 3 && data.user_profix_list.length > 0) {
        //     this.find("layoutPlayer").setContentSize({width : 960, height : 240})
        //     this.node.setContentSize({width : 960, height : 240})
        // }
        // else if (data.user_profix_list.length <= 6 && data.user_profix_list.length > 3) {
        //     this.find("layoutPlayer").setContentSize({width : 960, height : 310})
        //     this.node.setContentSize({width : 960, height : 310})
        // }
        // else if (data.user_profix_list.length <= 9 && data.user_profix_list.length > 6)
        // {
        //     this.find("layoutPlayer").setContentSize({width : 960, height : 400})
        //     this.node.setContentSize({width : 960, height : 400})
        // }
        // else {
        //     this.find("layoutPlayer").setContentSize({width : 960, height : 150})
        //     this.node.setContentSize({width : 960, height : 150})
        // }
    },

    showMyselfBg: function showMyselfBg() {
        if (this.data.owner_profix.uid == gUserData.uid) {
            this.find("owner").node.bg_myself.node.active = true;
            return;
        }

        for (var i = 0; i < this.data.user_profix_list.length; i++) {
            var user_profit = this.data.user_profix_list[i];
            var player = this.find("player" + (i + 1));
            if (user_profit.uid == gUserData.uid) {
                player.node.bg_myself.node.active = true;
                return;
            }
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
        //# sourceMappingURL=TotalBattleRecordItem.js.map
        