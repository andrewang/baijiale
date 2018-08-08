"use strict";
cc._RF.push(module, '9e247JQwdtBH4olTrsMs9IT', 'DismissRoomView');
// scripts/app/game/view/DismissRoom/DismissRoomView.js

"use strict";

var BaseView = require("BaseView");
cc.Class({
    extends: BaseView,

    properties: {},

    onLoad: function onLoad() {
        this.timeProgress = this.find("timeProgress");
        this.txtTime = this.find("txtTime");
        cc.eventMgr.addEvent("on_room_close_affirm", this.on_room_close_affirm, this);
    },

    on_room_close_affirm: function on_room_close_affirm(ret) {
        //有人不同意
        if (3 == ret.type) {
            var playerName = cc.gameMgr.getPlayerInfoByUID(ret.uid).name;
            cc.common.showMsgBox({ type: 1, msg: playerName + "拒绝解散房间，本次投票无效" });
            this.hide();
        }
        //全部人同意解散房间
        else if (2 == ret.type) {
                //如果没打完一局全部玩家同意解散则直接解散房间，否则需要弹总结算界面
                if (cc.gameMgr.curJushu <= 1) {
                    cc.common.showMsgBox({
                        type: 2, msg: "解散房间成功", okCb: function okCb() {
                            cc.gameMgr.backToLobbyScene();
                        }
                    });
                    //cc.gameMgr.backToLobbyScene()
                } else {
                    cc.common.showMsgBox({
                        type: 2, msg: "解散房间成功", okCb: function okCb() {}
                    });
                }
            } else if (1 == ret.type) {
                this.updatePlayer({ uid: ret.uid, agree: ret.type });
            }
    },

    //data: {uid, agree}
    updatePlayer: function updatePlayer(data) {
        var player = this.getPlayer(data.uid);
        player.setData(data);
    },

    setData: function setData(data) {
        this.find("txtWho").string = cc.gameMgr.getPlayerInfoByUID(data.launch_uid).name + " 申请解散房间，请等待其他玩家确认（超时未操作，视为同意）";
        var sec = 60 - (getCurTime() - data.launch_time);
        cc.log(getCurTime(), data.launch_time, sec, timeOffset);
        if (null == this.timeInterval) {
            this.timeInterval = function () {
                if (sec < 0) {
                    this.hide();
                    return;
                }
                this.timeProgress.getComponent(cc.ProgressBar).progress = sec / 60;
                this.txtTime.string = sec;
                sec -= 1;
            }.bind(this);

            cc.director.getScheduler().schedule(this.timeInterval, this, 1);
        }
        var personList = clone(cc.gameMgr._otherPlayerDatas);
        personList.push(clone(cc.gameMgr._myData));
        if (!cc.gameMgr.isRoomOwner()) {
            personList.push(clone(cc.gameMgr._roomOwnerData));
        }
        this.personList = personList;

        for (var i = 0; i < 10; i++) {
            this.find("player" + (i + 1)).node.active = false;
        }
        for (var i = 0; i < personList.length; i++) {
            this.find("player" + (i + 1)).setData({ uid: personList[i].user_base_info.uid, agree: 0 });
        }

        for (var i = 0; i < data.agree_list.length; i++) {
            var player = this.getPlayer(data.agree_list[i].uid);
            player.setData(data.agree_list[i]);
            //如果是本人发起的请求解散房间，隐藏掉 同意拒绝按钮
            if (data.agree_list[i].uid == gUserData.uid && 1 == data.agree_list[i].agree) {
                this.find("btn_agree").active = false;
                this.find("btn_refuse").active = false;
            }
        }
    },

    getPlayer: function getPlayer(uid) {
        for (var i = 0; i < this.personList.length; i++) {
            var player = this.find("player" + (i + 1));
            if (uid == player.data.uid) {
                return player;
            }
        }
    },

    agree: function agree() {
        this.find("btn_agree").active = false;
        this.find("btn_refuse").active = false;
        cc.netMgr.request("room_close_affirm", { agree: 1 }, function (ret) {
            cc.netMgr.exec(ret, function () {});
        });
    },

    disagree: function disagree() {
        this.find("btn_agree").active = false;
        this.find("btn_refuse").active = false;
        cc.netMgr.request("room_close_affirm", { agree: 0 }, function (ret) {
            cc.netMgr.exec(ret, function () {});
        });
    },

    hide: function hide() {
        this._super();
        this.clearTimeInterval();
    },

    clearTimeInterval: function clearTimeInterval() {
        if (this.timeInterval) {
            // clearInterval(this.timeInterval)
            cc.director.getScheduler().unschedule(this.timeInterval, this);
            this.timeInterval = null;
        }
    },

    onDestroy: function onDestroy() {
        this._super();
        this.clearTimeInterval();
        cc.eventMgr.removeEvent("on_room_close_affirm", this.on_room_close_affirm);
    },

    show: function show() {
        this._super();
        this.find("btn_agree").active = true;
        this.find("btn_refuse").active = true;
    },

    onDisable: function onDisable() {
        this.timeProgress.getComponent(cc.ProgressBar).progress = 1;
        this.txtTime.string = 60;
    }
});

cc._RF.pop();