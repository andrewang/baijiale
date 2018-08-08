"use strict";
cc._RF.push(module, '335f0AqmdVAr5T7qsfdk2YA', 'MallView');
// scripts/app/lobby/view/mall/MallView.js

"use strict";

var BaseView = require("BaseView");
var http = require("Http");

cc.Class({
    extends: BaseView,

    properties: {
        diamondImages: {
            default: [],
            type: [cc.SpriteFrame]
        }
    },

    onLoad: function onLoad() {
        this._super();
        for (var i = 0; i < 6; i++) {
            this["mallItemDiamond" + i] = this.find("mallItemDiamond" + i);
            this["mallItemDiamond" + i].js = this["mallItemDiamond" + i].getComponent("MallItem");
            this["mallItemDiamond" + i].js.onLoad();
            this["mallItemDiamond" + i].js.type = 1;
            this["mallItemDiamond" + i].js.init({ number: i, MallView: this });
        }

        for (var _i = 0; _i < 6; _i++) {
            this["mallItemCard" + _i] = this.find("mallItemCard" + _i);
            this["mallItemCard" + _i].js = this["mallItemCard" + _i].getComponent("MallItem");
            this["mallItemCard" + _i].js.onLoad();
            this["mallItemCard" + _i].js.type = 2;
            this["mallItemCard" + _i].js.init({ number: _i, MallView: this });
        }

        this.toggleDiamond = this.find("toggleDiamond");
        this.toggleRoomCard = this.find("toggleRoomCard");
        this.diamondNode = this.find("diamondNode");
        this.roomCardNode = this.find("roomCardNode");
        this.pay = this.find("payMainWindow");
        this.pay.js = this.pay.getComponent("MallPay");
        // this.testData()

        cc.eventMgr.addEvent("updatePlayerInfoSuccess", function () {
            this.updateDiamondAndRoomCardNum();
            this.pay.js.hide();
            this.hide;
        }, this);

        this.updateDiamondAndRoomCardNum();

        this.handleExamine();
    },

    updateDiamondAndRoomCardNum: function updateDiamondAndRoomCardNum() {
        this.find("txtDiamondNum").string = gUserData.playerInfo.diamonds;
        this.find("txtRoomCardNum").string = gUserData.playerInfo.room_card;
    },

    onDestroy: function onDestroy() {
        this._super();
        cc.eventMgr.removeEvent("updatePlayerInfoSuccess", this.hide);
    },

    // testData: function () {
    //     let itemdata0 = { diamondNum: 3, presentDiamond: 0, rmb: 3 }
    //     let itemdata1 = { diamondNum: 6, presentDiamond: 6, rmb: 6 }
    //     let itemdata2 = { diamondNum: 12, presentDiamond: 12, rmb: 9 }
    //     let itemdata3 = { diamondNum: 24, presentDiamond: 24, rmb: 12 }
    //     let itemdata4 = { diamondNum: 48, presentDiamond: 48, rmb: 15 }
    //     let itemdata5 = { diamondNum: 96, presentDiamond: 96, rmb: 128 }
    //     var data_list = [itemdata0, itemdata1, itemdata2, itemdata3, itemdata4, itemdata5]
    //     this.setMallItemData(data_list)
    // },

    getDiamondImages: function getDiamondImages(number) {
        return this.diamondImages[number];
    },


    requestDiamondList: function requestDiamondList() {
        var t = 1;
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            t = 2;
        }
        var flag = 1;
        http.sendRequest("/game/diamond", { uid: gUserData.uid, type: t, flag: flag }, function (ret, status) {
            cc.log("shop", ret);
            // this.setMallItemData(ret.data.items)
            var data_list = ret.data.items;
            for (var i in data_list) {
                var data = data_list[i];
                if (this["mallItemDiamond" + i]) {
                    this["mallItemDiamond" + i].js.setData(data);
                }
            }
        }.bind(this));
    },

    requestRoomCardList: function requestRoomCardList() {
        var t = 1;
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            t = 2;
        }
        var flag = 1;
        http.sendRequest("/game/exchange_menus", { type: 1 }, function (ret, status) {
            cc.log("exchange_menus", ret);
            var data_list = ret.data;
            for (var i in data_list) {
                var data = data_list[i];
                if (this["mallItemCard" + i]) {
                    this["mallItemCard" + i].js.setData(data);
                }
            }
        }.bind(this));
    },

    show: function show(param) {
        this._super();
        this.requestDiamondList();
        this.requestRoomCardList();
        this.toggleDiamond.getComponent(cc.Toggle).isChecked = false;
        this.toggleRoomCard.getComponent(cc.Toggle).isChecked = false;
        if (1 == param) {
            this.toggleDiamond.getComponent(cc.Toggle).isChecked = true;
        } else if (2 == param) {
            this.toggleRoomCard.getComponent(cc.Toggle).isChecked = true;
        }
        this.showItems();
    },

    handleExamine: function handleExamine() {
        if (!IS_EXAMINE) {
            return;
        }
        this.find("applePayNode").active = false;
        this.find("treasurePayNode").active = false;
    },

    showItems: function showItems() {
        if (this.toggleDiamond.getComponent(cc.Toggle).isChecked) {
            this.diamondNode.active = true;
            this.roomCardNode.active = false;
        } else {
            this.diamondNode.active = false;
            this.roomCardNode.active = true;
        }
    }

});

cc._RF.pop();