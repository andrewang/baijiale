"use strict";
cc._RF.push(module, 'efbabaZUX1Dsp9tNq15qwuj', 'SingleResultView');
// scripts/app/game/view/SingleResult/SingleResultView.js

"use strict";

//单局结算只有房主才会弹
var BaseView = require("BaseView");

cc.Class({
    extends: BaseView,

    properties: {
        moduleName: {
            override: true,
            default: "SingleResult",
            visible: false
        }

    },

    onLoad: function onLoad() {
        this._super
        // this.init()
        ();
    },

    setData: function setData(data) {
        for (var i = 1; i <= 9; i++) {
            this.find("player" + i).node.active = false;
        }

        // this.find("txtMyTotalPoint").string = "总计: " + data.owner_win_jetton
        if (data.owner_win_jetton >= 0) {
            this.find("txtMyTotalPoint").node.color = cc.Color.WHITE.fromHEX("#FFF568");
            this.find("txtMyTotalPoint").string = "+" + data.owner_win_jetton;
        } else {
            this.find("txtMyTotalPoint").node.color = cc.Color.WHITE.fromHEX("#ED1C24");
            this.find("txtMyTotalPoint").string = data.owner_win_jetton;
        }
        for (var i = 0; i < data.user_win_list.length; i++) {
            var info = data.user_win_list[i]; //{uid, win_jetton}
            var seatData = cc.gameMgr.getSeatDataByUID(info.uid //{seat, user_base_info}
            );var user_base_info = seatData.user_base_info; //{uid, name, avatar, gender, diamonds}
            var itemJs = this.find("player" + (i + 1));
            itemJs.setData({ user_base_info: clone(user_base_info), point: info.win_jetton });
            itemJs.node.active = true;
        }

        var cardList = cc.gameMgr.view.cardList;
        for (var i = 1; i <= 6; i++) {
            var num = cardList[i].js.getCardNum();
            var type = cardList[i].js.getCardType();
            this.find("nodeCard" + i).active = num != 0;
            if (num != 0) {
                cc.resMgr.updateSprite(this.find("card" + i), cc.resMgr.getCardResResultName({ type: type, num: num }));
            }
        }
        var xianList = [cardList[1], cardList[2], cardList[5]];
        var zhuangList = [cardList[3], cardList[4], cardList[6]];
        var xianPoint = 0;
        var zhuangPoint = 0;
        for (var i = 0; i < xianList.length; i++) {
            var num = xianList[i].js.getCardNum();
            if (num >= 10) {
                num = 0;
            }
            xianPoint += num;
        }
        for (var i = 0; i < zhuangList.length; i++) {
            var num = zhuangList[i].js.getCardNum();
            if (num >= 10) {
                num = 0;
            }
            zhuangPoint += num;
        }
        this.find("txtPointXian").string = xianPoint % 10;
        this.find("txtPointZhuang").string = zhuangPoint % 10;

        var xp = xianPoint % 10;
        var zp = zhuangPoint % 10;
        this.find("win_zhuang").node.active = false;
        this.find("win_xian").node.active = false;
        this.find("win_he").node.active = false;
        if (xp == zp) {
            this.find("win_he").node.active = true;
        } else if (xp > zp) {
            this.find("win_xian").node.active = true;
        } else {
            this.find("win_zhuang").node.active = true;
        }
    }
});

cc._RF.pop();