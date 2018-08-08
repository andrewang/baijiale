(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/game/view/BattleRecord/SingleBattleRecordView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '54267ygu75HmYUuZhLscqjx', 'SingleBattleRecordView', __filename);
// scripts/app/game/view/BattleRecord/SingleBattleRecordView.js

"use strict";

var BaseView = require("BaseView");
var http = require("Http");
var serverRoomDesc = require("JoinRoomConfig").serverRoomDesc;

cc.Class({
    extends: BaseView,

    properties: {},

    onLoad: function onLoad() {
        this._super();
        this.svLayout = this.find("svLayout");
        this.lock = true;
        this.find("scrollview").on('scroll-to-bottom', function () {
            if (this.lock) {
                this.lock = false;
                this.reqGameRecord(this.rid);
            }
        }, this);
    },

    setData: function setData(data) {
        this.find("txtRoomId").string = "房间号:" + data.room_num;
        // this.find("txtYazhu").string = "最低-最高:" + serverRoomDesc["bet_limit_type"][data.bet_limit_type]
        this.find("txtYazhu").string = "最低-最高:" + gUserData.roomInfo.room_setup_info.low_bet + "-" + gUserData.roomInfo.room_setup_info.hig_bet;
        // this.find("txtJushu").string = "局数:" + serverRoomDesc["inning_limit_type"][data.inning_limit_type]
        this.find("txtJushu").string = "局数:" + data.max_inning_num;
        var newDate = new Date();
        newDate.setTime(data.open_room_time * 1000);
        this.find("txtTime").string = formatDate(newDate);
    },

    reqGameRecord: function reqGameRecord(rid) {
        this.rid = rid;
        var self = this;
        http.sendRequest("/game/inning_record", { rid: this.rid, page: this.iPage, uid: gUserData.uid }, function (ret) {
            cc.log(ret);
            cc.netMgr.exec(ret, function () {
                self.addItem(ret.inning_record_info_list);
                self.iPage++;
                self.lock = true;
            });
        });
    },

    reqGameRoomData: function reqGameRoomData() {
        var self = this;
        var data = { page: 1, uid: gUserData.uid };
        http.sendRequest("/game/room_record", data, function (ret) {
            cc.log(ret);
            cc.netMgr.exec(ret, function () {
                for (var index in ret.room_record_info_list) {
                    var Data = ret.room_record_info_list[index];
                    if (self.rid == Data.rid) {
                        self.setData(Data);
                        return;
                    }
                }
            });
        });
    },

    addItem: function addItem(inning_record_info_list) {
        for (var i = 0; i < inning_record_info_list.length; i++) {
            var data = inning_record_info_list[i];
            var item = cc.instantiate(cc.res["prefabs/battleRecord/SingleBattleRecordItem"]);
            item.js = item.getComponent("SingleBattleRecordItem");
            item.parent = this.svLayout.node;
            // item.js.owner_uid = this.owner_uid
            item.js.owner_base_info = this.owner_base_info;
            item.js.seat_info_list = this.seat_info_list;
            item.js.setData(data);
            this.totalHeight += item.getContentSize().height + this.svLayout.spacingY;
        }
        // this.find("sv_content").setContentSize({ width: 960, height: this.totalHeight })
        setTimeout(function () {
            this.find("sv_content").setContentSize({ width: 960, height: this.svLayout.node.getContentSize().height });
        }.bind(this), 200);
    },

    show: function show() {
        this._super();
        this.svLayout.node.removeAllChildren();
        this.totalHeight = 0;
        this.iPage = 1;
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
        //# sourceMappingURL=SingleBattleRecordView.js.map
        