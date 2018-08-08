"use strict";
cc._RF.push(module, '9d32cL7rV5H8a3rMwGmFGP5', 'LoginScene');
// scripts/app/login/LoginScene.js

"use strict";

var BaseScene = require("BaseScene");
var EventMgr = require("EventMgr");
require("LogMgr");
var NetMgr = require("NetMgr");
var ResMgr = require("ResMgr");
var MusicMgr = require("MusicMgr");
var GameToAppHelper = require("GameToAppHelper");
var localConfig = require("localConfig");
cc.appToGameHelper = require("AppToGameHelper");

cc.Class({
    extends: BaseScene,
    properties: {
        moduleName: {
            override: true,
            default: "Login",
            visible: false
        }
    },

    onLoad: function onLoad() {
        this._super();

        this.find("nodeHotUpdate").node.active = false;

        cc.eventMgr = new EventMgr();

        // require("localConfig")
        // cc.log(jsb.fileUtils)
        // var data = jsb.fileUtils.getDataFromFile(customHttpRequest._fileName);

        // this.editAccount.string = "1"
        // this.Canvas.editAccount.string = "1"
        // this.uiContainer.editAccount.string = "1"
        // this.uiContainer.Canvas.editAccount.string = "1"

        if (cc.sys.isNative) {
            cc.Device.setKeepScreenOn(true);
        }
        this.find("editAccount").string = localConfig.uid;
        this.find("password").string = localConfig.password;
        var data = null;
        //test data
        // data = {uid : "18018018001", gameData : {isHide : true}, serverType : "pro"}
        try {
            data = GameToAppHelper.getGameEnterInitData();
            data = JSON.parse(data);
        } catch (error) {}
        if (data) {
            cc.log("====getGameEnterInitData", data);
            gUserData.uid = data.uid;
            gUserData.dingdingData = data;
            setExamine(gUserData.dingdingData.gameData.isHide);
            //应用控制连的服务器地址
            var serverType = data.serverType;
            if ("dev" == serverType) {
                gHost = gHostDev;
            } else if ("test" == serverType) {
                gHost = gHostTest;
            } else if ("pro" == serverType) {
                gHost = gHostPro;
            }
            cc.log("应用控制连的服务器地址", serverType, gHost);
            this.init();
            // cc.director.loadScene('LobbyScene')
        } else {
            this.loadServerSelect();
        }
        // cc.log(cc.sys.localStorage.getItem('ruleData'))
        // var jsonTest = JSON.parse("{\"hello\": 233, \"name\":bb}")
        // var jsonTest = JSON.parse("{\"a\"}")
        // var jsonTest = JSON.parse('[{"CityId":18,"CityName":"西安","ProvinceId":27,"CityOrder":1},{"CityId":53,"CityName":"广州","ProvinceId":27,"CityOrder":1}]')
        // cc.log(jsonTest)


        // cc.log("platform:", cc.sys.platform, cc.sys.platform.MACOS == cc.sys.platform, cc.sys.platform.MACOS, cc.sys.isNative)
        //路单测试
        // setTimeout(function name(params) {
        //     cc.loader.loadRes("prefabs/wayBill/WayBillView", function (err, prefab) {
        //         cc.res["prefabs/wayBill/WayBillView"] = prefab
        //         var view = cc.instantiate(prefab)
        //         view.parent = self.node
        //        view.getComponent("WayBillView").test()
        //     })
        // }, 200)

        //游戏总结算测试
        // cc.loader.loadRes("prefabs/totalResult/TotalResultView", function (err, prefab) {
        //     cc.res["prefabs/totalResult/TotalResultView"] = prefab
        //     var view = self.openView("prefabs/totalResult/TotalResultView")
        // })

        //设置
        // cc.loader.loadRes("prefabs/settingView/SettingView", function (err, prefab) {
        //     cc.res["prefabs/settingView/SettingView"] = prefab
        //     var view = self.openView("prefabs/settingView/SettingView")
        // })

        //解散房间
        // cc.loader.loadRes("prefabs/dismissRoom/DismissRoomView", function (err, prefab) {
        //     cc.res["prefabs/dismissRoom/DismissRoomView"] = prefab
        //     var view = self.openView("prefabs/dismissRoom/DismissRoomView")
        //     view.setData()
        // })

        //聊天
        // cc.loader.loadRes("prefabs/chat/ChatView", function (err, prefab) {
        //     cc.res["prefabs/chat/ChatView"] = prefab
        //     var view = self.openView("prefabs/chat/ChatView")
        // })

        //战绩
        // cc.resMgr.loadPrefab("prefabs/battleRecord/TotalBattleRecordItem")
        // setTimeout(function name(params) {
        //     cc.loader.loadRes("prefabs/battleRecord/TotalBattleRecordView", function (err, prefab) {
        //         cc.res["prefabs/battleRecord/TotalBattleRecordView"] = prefab
        //         var view = self.openView("prefabs/battleRecord/TotalBattleRecordView")
        //     })
        // }, 300)


        // cc.resMgr = new ResMgr()
        // cc.resMgr.init()
        // cc.res = cc.resMgr.resList

        //消息条
        // var i = 1
        // setInterval(function () {
        //     cc.common.showMsgBox({ type: 1, msg: "第" + i + "条信息" })
        //     i++
        // }, 300)
        // cc.common.showMsgBox({ type: 2, msg: "fff水电费水电费",  cb : function () {
        //     cc.log("aaaaa")
        // }})

        // cc.musicMgr.setVolume(0.1)
        // cc.musicMgr.playEffect("send_card_zhuang.mp3")

        // var jipaiNode = this.find("jipaiNode")
        // jipaiNode.getComponent("ThreeDCard").init()
        // var jipaiNode2 = this.find("jipaiNode2")
        // jipaiNode2.getComponent("ThreeDCard").init()

        // var cardTest = this.find("cardTest")
        // cardTest.reset()
        // cardTest.showBack()
        // cardTest.setData({cards: 1, type : 1}, 1)
        // cardTest.moveToSqueeze({x : 414, y: 6})

        // this.find("aniXiandui").getComponent(cc.Animation).on('stop', function () {
        //     this.find("aniXiandui").active = false
        // },this)
        // setTimeout(function () {
        //     this.find("aniXiandui").getComponent(cc.Animation).play()
        // }.bind(this), 1000)

        // var cutCtrlNode = this.find("cutControl")
        // cutCtrlNode.on(cc.Node.EventType.TOUCH_MOVE, function (touch) {
        //     var pos = cutCtrlNode.parent.convertTouchToNodeSpaceAR(touch)
        //     if (pos.x <= 240 && pos.x >= -240) {
        //         cutCtrlNode.position = { x: pos.x, y: cutCtrlNode.position.y }
        //         cutCtrlNode.scaleX = pos.x / 240
        //     }
        // }, this)
        // cutCtrlNode.on(cc.Node.EventType.TOUCH_START, function () {

        // }, this)
        // cutCtrlNode.on(cc.Node.EventType.TOUCH_END, function (touch) {

        // }, this)

        // this.timerAudioId = cc.musicMgr.playEffect("daojishi.mp3", true)
        // cc.audioEngine.stop(this.timerAudioId)

        //进入后台 
        // cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function (event) {
        //     cc.log("进入后台")
        // });
        // // //恢复显示 
        // cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function (event) {
        //     cc.log("进入前台")
        // });

        // this.find("aniXiandui").getComponent(cc.Animation).on('stop', function () {
        //     this.find("aniXiandui").active = false
        // }, this)
        // this.find("aniWin").getComponent(cc.Animation).on('stop', function () {
        //     this.find("aniWin").active = false
        // }, this)

        // cc.director.getScheduler().schedule(function () {
        //     cc.log("vvvv")
        // }, this, 1, 0, 0, false)
        // cc.log("kkk")
        // scheduleTimeOut(function () {
        //     cc.log("iii")
        // }, this, 0.5)

        // cc.log("1111")
        // scheduleTimeOut(function () {
        //     cc.log("iii")
        // }, this, 2)
        // cc.log("2222")
        // outputObj(jsb.fileUtils)
    },

    login: function login() {
        this.init();
        gUserData.uid = Number(this.find("editAccount").string);
        gUserData.password = this.find("password").string;
        // cc.director.loadScene('LobbyScene')

        this.saveServerSelect();

        // this.find("node_quanxian_zhuang").getComponent("PowerObj").flip()

        // this.find("aniXiandui").active = true
        // this.find("aniXiandui").getComponent(cc.Animation).play()
        // this.find("aniWin").active = true
        // this.find("aniWin").getComponent(cc.Animation).play()

        // var card = cc.instantiate(cc.res["prefabs/card/Card"])
        // card.parent = this.node
        // card.js.reset()
        // card.js.showBack()
        // card.js.setData({cards: 1, type: 1}, 1)
        // card.js.flip()

        // cc.director.getScheduler().unscheduleAllForTarget(this)
        // cc.log("3333")
    },

    saveServerSelect: function saveServerSelect() {
        var children = this.find("New ToggleContainer")._children;
        for (var i = 0; i < children.length; i++) {
            var toggle = children[i].getComponent(cc.Toggle);
            if (toggle.isChecked) {
                cc.sys.localStorage.setItem("connectServer", children[i]._name);
                break;
            }
        }
        var connectServer = cc.sys.localStorage.getItem('connectServer');
        if (connectServer == "toggle1") {
            gHost = gHostDev;
        } else if (connectServer == "toggle2") {
            gHost = gHostTest;
        } else if (connectServer == "toggle3") {
            gHost = gHostPro;
        }
    },

    loadServerSelect: function loadServerSelect() {
        cc.log("loadServerSelect++++");
        var connectServer = cc.sys.localStorage.getItem('connectServer');
        var children = this.find("New ToggleContainer")._children;
        for (var i = 0; i < children.length; i++) {
            var toggle = children[i].getComponent(cc.Toggle);
            toggle.isChecked = false;
        }
        if (connectServer) {
            this.find(connectServer).getComponent(cc.Toggle).isChecked = true;
        } else {
            gHost = gHostTest; //默认测试服
            this.find("toggle2").getComponent(cc.Toggle).isChecked = true;
        }
    },

    onDestroy: function onDestroy() {
        // cc.log("onDestroy")
    },

    start: function start() {
        this._super();
    },

    onBtnUpdate: function onBtnUpdate() {
        this.find("nodeHotUpdate").node.active = !this.find("nodeHotUpdate").node.active;
    },

    init: function init() {
        var self = this;
        cc.netMgr = new NetMgr();
        cc.netMgr.initData();
        cc.eventMgr = new EventMgr();
        cc.resMgr = new ResMgr();
        cc.resMgr.init();
        cc.res = cc.resMgr.resList;
        cc.musicMgr = new MusicMgr();
    }

});

cc._RF.pop();