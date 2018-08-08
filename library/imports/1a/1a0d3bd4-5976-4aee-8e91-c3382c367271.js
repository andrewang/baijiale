"use strict";
cc._RF.push(module, '1a0d3vUWXZK7o6RwzgsNnJx', 'TotalResultView');
// scripts/app/game/view/TotalResult/TotalResultView.js

"use strict";

var BaseView = require("BaseView");

cc.Class({
    extends: BaseView,

    properties: {
        moduleName: {
            override: true,
            default: "TotalResult",
            // type: 'String',
            visible: false
        }

    },

    onLoad: function onLoad() {
        // this._super()
        this.handleExamine();
    },

    //data :{user_win_total_list, owner_win_total}
    setData: function setData(data) {
        this.data = data;

        for (var i = 1; i <= 9; i++) {
            this.find("player" + i).node.active = false;
        }

        this.find("player0").setData({ user_base_info: clone(gUserData.roomInfo.owner_base_info), point: data.owner_win_total }, true);
        for (var i = 0; i < data.user_win_total_list.length; i++) {
            var info = data.user_win_total_list[i]; //{uid, win_jetton}
            var seatData = cc.gameMgr.getSeatDataByUID(info.uid); //{seat, user_base_info}
            var user_base_info = seatData.user_base_info; //{uid, name, avatar, gender, diamonds}
            var itemJs = this.find("player" + (i + 1));
            itemJs.setData({ user_base_info: clone(user_base_info), point: info.win_jetton }, false);
            itemJs.node.active = true;
        }

        this.showJuShu(gUserData.roomInfo.room_setup_info.inning_num);
        this.showJoin(gUserData.roomInfo.room_setup_info.midway_join);
        // this.showYaZhu(gUserData.roomInfo.room_setup_info.bet_limit_type)
        this.showYaZhu();
    },

    //这个是通过战绩数据显示结算界面，玩家在牌局途中离线，房间解散后再上线则需要显示结算界面
    setTotalBattleRecordData: function setTotalBattleRecordData(data) {
        this.onUpAGame_data = data;
        for (var i = 1; i <= 9; i++) {
            this.find("player" + i).node.active = false;
        }

        var getSeatDataByUID = function getSeatDataByUID(uid) {
            for (var i = 0; i < data.seat_info_list.length; i++) {
                var seatInfo = data.seat_info_list[i];
                if (uid == seatInfo.user_base_info.uid) {
                    return seatInfo;
                }
            }
        };

        this.find("player0").setData({ user_base_info: clone(data.owner_base_info), point: data.owner_profix.win_jetton }, true);
        for (var i = 0; i < data.user_profix_list.length; i++) {
            var info = data.user_profix_list[i]; //{uid, win_jetton}
            var seatData = getSeatDataByUID(info.uid); //{seat, user_base_info}
            var user_base_info = seatData.user_base_info; //{uid, name, avatar, gender, diamonds}
            var itemJs = this.find("player" + (i + 1));
            itemJs.setData({ user_base_info: clone(user_base_info), point: info.win_jetton }, false);
            itemJs.node.active = true;
        }

        this.showJuShu(data.max_inning_num);
        this.showJoin(data.midway_join);
        // this.showYaZhu(data.bet_limit_type)
        this.showYaZhu();
    },

    backToLobbyScene: function backToLobbyScene() {
        if (cc.gameMgr.isForbidGame) {
            cc.common.showMsgBox({
                type: 2, msg: "游戏停止运营，房间已解散", okCb: function okCb() {
                    GameToAppHelper.ExitGame();
                }
            });
            return;
        }
        if (cc.gameMgr) {
            cc.gameMgr.backToLobbyScene();
        } else {
            this.hide();
        }
    },

    onDetailBtn: function onDetailBtn() {
        var prent = cc.sceneNode.js.find("singleBattleRecordNode");
        var view = cc.sceneNode.js.openView("prefabs/battleRecord/SingleBattleRecordView", prent ? prent.node : null);
        // view.owner_uid = gUserData.roomInfo.owner_base_info.uid
        // view.owner_name = gUserData.roomInfo.owner_base_info.name
        view.owner_base_info = gUserData.roomInfo.owner_base_info ? gUserData.roomInfo.owner_base_info : this.onUpAGame_data.owner_base_info;
        view.seat_info_list = gUserData.roomInfo.seat_info_list ? gUserData.roomInfo.seat_info_list : this.onUpAGame_data.seat_info_list;
        view.reqGameRecord(gUserData.roomInfo.rid ? gUserData.roomInfo.rid : this.onUpAGame_data.rid);
        view.reqGameRoomData();
    },

    showYaZhu: function showYaZhu(type) {
        // if (1 == type) {
        //     this.find("txt3").string = "押注：1-1千"
        // }
        // else if (2 == type) {
        //     this.find("txt3").string = "押注：10-1万"
        // }
        this.find("txt3").string = "押注：" + this.data.low_bet + "-" + this.data.hig_bet;
    },

    showJoin: function showJoin(type) {
        if (1 == type) {
            this.find("txt2").string = "允许中途加入";
        } else if (2 == type) {
            this.find("txt2").string = "不允许中途加入";
        }
    },

    showJuShu: function showJuShu(type) {
        // var totalJushu = 0
        // if (1 == type) {
        //     totalJushu = 20
        // }
        // else if (2 == type) {
        //     totalJushu = 50
        // }
        // else if (3 == type) {
        //     totalJushu = 80
        // }
        var totalJushu = type;
        this.find("txt1").string = "游戏局数：" + totalJushu + "局";
    },

    onShareBtn: function onShareBtn() {
        //截图
        if (CC_JSB) {
            //如果待截图的场景中含有 mask，请使用下面注释的语句来创建 renderTexture
            var winSize = cc.director.getWinSize();
            // var renderTexture = cc.RenderTexture.create(1280, 720, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
            var renderTexture = cc.RenderTexture.create(winSize.width, winSize.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
            //实际截屏的代码
            renderTexture.begin();
            //this.richText.node 是我们要截图的节点，如果要截整个屏幕，可以把 this.richText 换成 Canvas 切点即可
            // this.node._sgNode.visit();
            cc.find("Canvas")._sgNode.visit();
            renderTexture.end();
            renderTexture.saveToFile("jietu.png", cc.ImageFormat.PNG, true, function () {
                cc.log("capture screen successfully!");
                //打印截图路径
                cc.log(jsb.fileUtils.getWritablePath());
                var LogMgr = require("LogMgr");
                LogMgr.append("capture screen successfully!\n");
                LogMgr.append(jsb.fileUtils.getWritablePath() + "\n");

                var view = cc.sceneNode.js.openView("prefabs/share/ShareView2");
            });
        }
    },

    //处理审核
    handleExamine: function handleExamine() {
        if (!IS_EXAMINE) {
            return;
        }
        this.find("btnShare").active = false;
    }

});

cc._RF.pop();