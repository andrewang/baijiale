var BaseScene = require("BaseScene")
var EventMgr = require("EventMgr")
require("LogMgr")
var NetMgr = require("NetMgr")
var ResMgr = require("ResMgr")
var MusicMgr = require("MusicMgr")
var GameToAppHelper = require("GameToAppHelper")
var localConfig = require("localConfig")
cc.appToGameHelper = require("AppToGameHelper")

cc.Class({
    extends: BaseScene,
    properties: {
        moduleName: {
            override: true,
            default: "Login",
            visible: false,
        },
    },

    onLoad: function () {
        this._super()

        // this.find("nodeHotUpdate").node.active = false
        this.find("loginNode").active = false
        this.progress_bar = this.find("progress_bar")
        this.updateViewNode = this.find("updateViewNode")
        this.assetMgr = this.node.getComponent("assetMgr")
        cc.eventMgr = new EventMgr()

        cc.log("监听")
        // cc.eventMgr.addEvent("enterEntry", this.init, this)
        cc.eventMgr.addEvent("enterEntry", this.initModule, this)
        cc.eventMgr.addEvent("hotUpdateProgress", this.hotUpdateProgress, this)
        
        this.init()
    },

    init: function () {
        // sys.localStorage.clear()
        if (cc.sys.isNative) {
            cc.Device.setKeepScreenOn(true)
        }
        this.find("editAccount").string = localConfig.uid
        this.find("password").string = localConfig.password
        // if (cc.sys.isNative) {
            this.loadAccountInfo()
        // }
        var data = null
        //test data
        // data = {uid : "18018018001", gameData : {isHide : true}, serverType : "pro"}
        try {
            data = GameToAppHelper.getGameEnterInitData()
            data = JSON.parse(data)
        } catch (error) {

        }
        if (data) {
            cc.log("====getGameEnterInitData", data)
            gUserData.uid = data.uid
            gUserData.dingdingData = data
            setExamine(gUserData.dingdingData.gameData.isHide)
            //应用控制连的服务器地址
            var serverType = data.serverType
            if ("dev" == serverType) {
                gHost = gHostDev
                versionType = "Test"
            }
            else if ("test" == serverType) {
                gHost = gHostTest
                versionType = "Test"
            }
            else if ("pro" == serverType) {
                gHost = gHostPro
                versionType = "Master"
            }
            cc.log("应用控制连的服务器地址", serverType, gHost)
            // this.initModule()
            this.assetMgr.begin()
        }
        else {
            this.loadServerSelect()
            if (cc.sys.isNative) {
                versionType = "Test"
                // versionType = "Master"
                this.assetMgr.begin()
            }
            this.find("loginNode").active = true
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

    login: function () {
        this.initModule()
        gUserData.uid = Number(this.find("editAccount").string)
        gUserData.password = this.find("password").string
        gUserData.testGroup_id = Number(this.find("testGroup_id").string)
        // cc.director.loadScene('LobbyScene')

        this.saveServerSelect()
        this.saveAccountInfo()

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

    saveServerSelect: function () {
        var children = this.find("New ToggleContainer")._children
        for (var i = 0; i < children.length; i++) {
            var toggle = children[i].getComponent(cc.Toggle)
            if (toggle.isChecked) {
                cc.sys.localStorage.setItem("connectServer", children[i]._name)
                break
            }
        }
        var connectServer = cc.sys.localStorage.getItem('connectServer')
        if (connectServer == "toggle1") {
            gHost = gHostDev
        }
        else if (connectServer == "toggle2") {
            gHost = gHostTest
        }
        else if (connectServer == "toggle3") {
            gHost = gHostPro
        }
    },

    loadServerSelect: function () {
        cc.log("loadServerSelect++++")
        var connectServer = cc.sys.localStorage.getItem('connectServer')
        var children = this.find("New ToggleContainer")._children
        for (var i = 0; i < children.length; i++) {
            var toggle = children[i].getComponent(cc.Toggle)
            toggle.isChecked = false
        }
        if (connectServer) {
            this.find(connectServer).getComponent(cc.Toggle).isChecked = true
        }
        else {
            gHost = gHostTest //默认测试服
            this.find("toggle2").getComponent(cc.Toggle).isChecked = true
        }
    },

    saveAccountInfo: function () {
        // cc.sys.localStorage.setItem("editAccount", this.find("editAccount").string)
        if (-1 == this.accountList.indexOf(this.find("editAccount").string)) {
            this.accountList.push(this.find("editAccount").string)
            this.passwordList.push(this.find("password").string)
        }
        cc.sys.localStorage.setItem("accountList", JSON.stringify(this.accountList))
        cc.sys.localStorage.setItem("passwordList", JSON.stringify(this.passwordList))
        // cc.sys.localStorage.setItem("password", this.find("password").string)
    },

    loadAccountInfo: function () {
        if (cc.sys.localStorage.getItem('editAccount')) {
            // this.find("editAccount").string = cc.sys.localStorage.getItem('editAccount')
        }
        //账号列表
        if (cc.sys.localStorage.getItem('accountList')) {
            this.accountList = JSON.parse(cc.sys.localStorage.getItem('accountList'))
        }
        else {
            this.accountList = []
        }
        //密码列表
        if (cc.sys.localStorage.getItem('passwordList')) {
            this.passwordList = JSON.parse(cc.sys.localStorage.getItem('passwordList'))
        }
        else {
            this.passwordList = []
        }
        
        if (cc.sys.localStorage.getItem('password')) {
            // this.find("password").string = cc.sys.localStorage.getItem('password')
        }
        var layout = this.find("contentRecord").node
        
        for (var i = 0; i < this.accountList.length; i++) {
            var label = cc.instantiate(this.find("txtRecordAccount"))
            label.parent = layout
            label.getComponent("cc.Label").string = this.accountList[i]
            label.index = i
        }

    },

    onBtnRecordTxt: function (event) {
        // cc.log(event.target.getComponent("cc.Label").string)
        var node = event.target
        cc.log("index", node.index)
        this.find("editAccount").string = event.target.getComponent("cc.Label").string
        this.find("password").string = this.passwordList[node.index]
    },

    onDestroy: function () {
        // cc.log("onDestroy")
        // cc.eventMgr.removeEvent("enterEntry", this.init)
        cc.eventMgr.removeEvent("enterEntry", this.initModule)
        cc.eventMgr.removeEvent("hotUpdateProgress", this.hotUpdateProgress)
    },

    start: function () {
        this._super()
    },

    // onBtnUpdate: function () {
    //     this.find("nodeHotUpdate").node.active = !this.find("nodeHotUpdate").node.active
    // },

    hotUpdateProgress: function (event) {
        this.updateViewNode.active = true
        var progress = event.getDownloadedBytes() / event.getTotalBytes()
        cc.log("进度", progress, event.getDownloadedBytes() , event.getTotalBytes())
        this.progress_bar.getComponent(cc.Sprite).fillRange = progress
    },

    initModule: function () {
        var self = this
        cc.netMgr = new NetMgr()
        cc.netMgr.initData()
        cc.eventMgr = new EventMgr()
        cc.resMgr = new ResMgr()
        cc.resMgr.init()
        cc.res = cc.resMgr.resList
        cc.musicMgr = new MusicMgr()
    },

});
