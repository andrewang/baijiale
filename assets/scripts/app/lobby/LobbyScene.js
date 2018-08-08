var BaseScene = require("BaseScene");
var childViewIndex = require("LobbyConfig").childViewIndex
// var CustomHttpRequest = require("CustomHttpRequest")
// var CustomHttpClient = require("CustomHttpClient")
var Code = require('Code');
// var ProtoUtil = require("ProtoUtil")
var NetMgr = require("NetMgr")
var EventMgr = require("EventMgr")
var ResMgr = require("ResMgr")
var GameToAppHelper = require("GameToAppHelper")
var http = require("Http")

cc.Class({
    extends: BaseScene,
    properties: {
        moduleName: {
            override: true,
            default: "Lobby",
            // type: 'String',
            visible: false,
        },

        // childViews:{
        //     type:cc.Prefab,
        //     default:[]
        // }
    },

    onLoad: function () {
        // this.node.on("test", function (event) {
        //     cc.log("test", event.detail)
        // })
        //初始化
        this._super()
        if (!isInit) {
            isInit = true
            // cc.netMgr = new NetMgr()
            // cc.netMgr.initData()
            // cc.eventMgr = new EventMgr()
            // cc.resMgr = new ResMgr()
            // cc.resMgr.init()
            // cc.res = cc.resMgr.resList
            this.login()
        }
        this.requestCreateRoomCfg()
        this.requestForbidSetting()
        this.txtUid = this.find("txtUid")
        this.txtUid.string = ""
        this.txtName = this.find("txtName")
        this.txtName.string = ""
        this.txt_diamonds = this.find("txt_diamonds")
        this.txt_diamonds.string = ""
        this.txt_roomCard = this.find("txt_roomCard")
        this.txt_roomCard.string = ""

        this.initListener()
        cc.musicMgr.playLobbyBgm()
        this.updatePlayerInfo()
        if (gIsPopNotice) {
            gIsPopNotice = false
            this.requestNotice()
        }
        this.handleExamine()
    },

    initListener: function () {
        cc.eventMgr.addEvent("updatePlayerInfo", this.updatePlayerInfo, this)
        cc.eventMgr.addEvent("requestResultData", this.requestResultData, this)
        //进入后台 
        this.eventHideListener = cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function (event) {
            cc.log("大厅进入后台")
        }.bind(this));
        // //恢复显示 
        this.eventShowListener = cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function (event) {
            cc.log("大厅进入前台")
            cc.netMgr.onAppFront()
        }.bind(this));
    },

    onDestroy: function () {
        this._super()
        cc.eventMgr.removeEvent("updatePlayerInfo", this.updatePlayerInfo)
        cc.eventMgr.removeEvent("requestResultData", this.requestResultData)
        cc.eventManager.removeListener(this.eventHideListener)
        cc.eventManager.removeListener(this.eventShowListener)
    },

    // init: function () {
    //     //初始化
    //     if (!isInit) {
    //         isInit = true
    //         cc.netMgr = new NetMgr()
    //         cc.netMgr.initData()
    //         cc.eventMgr = new EventMgr()
    //         cc.resMgr = new ResMgr()
    //         cc.resMgr.init()
    //         cc.res = cc.resMgr.resList

    //         this.login()
    //     }
    // },

    update: function () {
        cc.netMgr.handleData()
    },

    login: function () {
        cc.sceneNode.js.showLoadingView()
        //如果不是通过丁丁平台登录的发这个协议模拟登录
        if ("" == gUserData.dingdingData.uToken) {
            this.requestValidate()
        }
        else {
            this.loginFunc()
        }

    },

    requestNotice: function () {
        http.sendRequest("/game/notices", {game_id : 1}, function (ret) {
            cc.log("公告", ret)

            cc.netMgr.exec(ret, function () {
                var list = ret.data.items
                var loadCompleteCount = 0
                var showNoticePop = function () {
                    for (var i = 0; i < list.length; i++) {
                        var data = list[i]
                        if (1 == data.pop_up) {
                            var prefab = cc.res["prefabs/notice/noticePopView"]
                            var view = cc.instantiate(prefab)
                            view.parent = this.node
                            view.js = view._components[0]
                            view.js.setData(data)
                        }
                    }
                }.bind(this)
                for (var i = 0; i < list.length; i++) {
                    var data = list[i]
                    //预加载网络图片
                    cc.loader.load(data.content, function (err, texture) {
                        loadCompleteCount = loadCompleteCount + 1
                        if (loadCompleteCount == list.length) {
                            showNoticePop()
                        }
                    })
                }
                if (0 == tableNums(list)) {
                 return   
                }
                var view = this.openView("prefabs/notice/noticeView")
                view.setData(list)
                var compare = function (a, b) {
                    if (a.sort < b.sort) {
                        return 1
                    } else if (a.sort > b.sort) {
                        return -1
                    } else {
                        if (a.id < b.id) {
                            return 1
                        }
                        else if (a.id > b.id) {
                            return 1
                        }
                        else {
                            return 0
                        }
                    }
                }
                //排序
                list.sort(compare)
                view.hide()
            }.bind(this))
        }.bind(this))
    },

    requestValidate: function () {
        var http = require("Http");
        var msg = { telephone: gUserData.uid.toString(), password: gUserData.password, system: 1, version: "" }
        http.sendRequest("/game/login", msg, function (ret, status) {
            if (ret.data) {
                gUserData.uid = ret.data.user_id
                gUserData.dingdingData.uToken = ret.data.auth_key
            }
            this.loginFunc()
        }.bind(this))
    },

    loginFunc: function () {
        cc.log("请求登录", gHost)
        cc.netMgr.login(function (socket, code) {
            if (!socket) {
                cc.common.showMsgBox({ type: 1, msg: Code.getCodeName(code) })
                //关闭长链接
                cc.log("关闭长链接")
                cc.netMgr.close(false);
            } else {
                cc.log("WS验证成功")

                var http = require("Http")
                var data = { uid: gUserData.uid }
                // cc.sceneNode.js.showLoadingView()
                http.sendRequest("/game/room_info", data, function (ret) {
                    cc.log(ret)
                    //当牌局已经结束的时候重连
                    if ("GameScene" == cc.director.getScene()._name && ret.code == Code.ROOM_PLAYER_NOT_IN_ROOM) {
                        cc.director.loadScene("LobbyScene")
                    }
                    cc.log(JSON.stringify(ret))
                    if (ret.code == Code.ROOM_PLAYER_NOT_IN_ROOM) {
                        cc.sceneNode.js.hideLoadingView()
                        cc.log("房间ID", gUserData.dingdingData.roomId, typeof (gUserData.dingdingData.roomId))
                        //test
                        // this.requestFindRoom(1000116)
                        if (gUserData.dingdingData.roomId) {
                            this.requestFindRoom(gUserData.dingdingData.roomId)
                        }
                    }
                    cc.netMgr.exec(ret, function () {
                        // gUserData.roomInfo = ret
                        gUserData.roomInfo = ret.room_info
                        cc.sceneNode.js.showLoadingView()
                        cc.director.loadScene("GameScene")
                    }.bind(this))
                }.bind(this));

                // this.updatePlayerInfo()
                cc.eventMgr.emit("updatePlayerInfo")
            }
        }.bind(this))
    },

    start: function () {
        this._super()
    },

    //群链接查询房间
    requestFindRoom: function (roomId) {
        http.sendRequest("/game/find_room_by_rid", { rid: roomId }, function (ret) {
            cc.log(ret)
            // cc.netMgr.exec(ret, function () {
            //     //先查询房间信息再让用户选择加不加入
            //     var roomInfoView = cc.sceneNode.js.openView("prefabs/joinRoom/RoomInfoView")
            //     roomInfoView.setData(clone(ret))
            // }.bind(this))
            if (ret.code == Code.OK) {
                //先查询房间信息再让用户选择加不加入
                var roomInfoView = cc.sceneNode.js.openView("prefabs/joinRoom/RoomInfoView")
                roomInfoView.setData(clone(ret))
            }
            else {
                //重复提示不显示
                if (cc.common.isRepetitionBar(ret.code)) {
                    return
                }
                //浏览器显示全部信息，方便调试
                if (cc.sys.isBrowser) {
                    cc.common.showMsgBox({ type: 1, msg: Code.getCodeName(ret.code), codeNumber: ret.code })
                }
                //真机显示部分信息，策划的需求
                else if (Code.isCanShow(ret.code)) {
                    if (1006 == ret.code) {
                        cc.common.showMsgBox({ type: 1, msg: "房间已解散", codeNumber: ret.code })
                    }
                    else {
                        cc.common.showMsgBox({ type: 1, msg: Code.getCodeName(ret.code), codeNumber: ret.code })
                    }
                }
            }
        }.bind(this))
    },

    updatePlayerInfo: function () {
        cc.netMgr.request("user_base_info", { uid: gUserData.uid }, function (ret) {
            cc.netMgr.exec(ret, function () {
                cc.log("更新个人信息", ret.user_base_info)
                gUserData.playerInfo = ret.user_base_info
                this.txtUid.string = i18n.dd_no + "：" + gUserData.playerInfo.ding_no
                this.txtName.string = gUserData.playerInfo.name
                this.txt_diamonds.string = gUserData.playerInfo.diamonds
                this.txt_roomCard.string = gUserData.playerInfo.room_card
                cc.resMgr.loadNetUrl(this.find("imgIcon"), gUserData.playerInfo.avatar)
                cc.eventMgr.emit("updatePlayerInfoSuccess")
            }.bind(this))
        }.bind(this))
    },

    //创建房间
    onBtnCreateRoom: function () {
        this.openView("prefabs/createRoom/CreateRoomView")
    },
    //加入房间
    onBtnJoinRoom: function () {
        this.openView("prefabs/joinRoom/JoinRoomView")
    },

    // //检查屏蔽游戏，两个平台都屏蔽时，不能游戏
    // checkForbidGame: function (forbidCb, normalCb) {
    //     //IOS
    //     http.sendRequest("/game/fetch_shields", { system: 1 }, function (ret, status) {
    //         cc.log(ret)
    //         if (1 == ret.data.disGame_baijiale) {
    //             normalCb()
    //             return false
    //         }
    //         //android
    //         http.sendRequest("/game/fetch_shields", { system: 2 }, function (ret, status) {
    //             cc.log(ret)
    //             if (1 == ret.data.disGame_baijiale) {
    //                 normalCb()
    //                 return false
    //             }
    //             else {
    //                 forbidCb()
    //                 return true;
    //             }
    //         }.bind(this))
    //     }.bind(this))
    // },

    //获取屏蔽设置
    requestForbidSetting: function () {
        var t
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            t = 2
        }
        else {
            t = 1
        }
        http.sendRequest("/game/fetch_shields", { system: t }, function (ret, status) {
            cc.log("#######", ret)
            gUserData.forbidSetting = ret.data
        }.bind(this))
    },

    //其它
    //返回
    onBTNBack: function () {
        //test
        //cc.netMgr.onAppBack()
        GameToAppHelper.ExitGame()
    },

    //设置
    onBtnSetting: function () {
        // cc.log(cc.res)
        var view = this.openView("prefabs/settingView/SettingView")
        view.find("btn_jrfj").active = false
    },

    //商店
    onBtnMall: function (eventTouch, param) {
        if (gUserData.forbidSetting.disDiamond_originalRecharge != 0) {
            this.openView("prefabs/mall/mallView", null, Number(param))
        }
    },

    //战绩
    showRecordView: function () {
        this.openView("prefabs/battleRecord/TotalBattleRecordView", this.find("totalBattleRecordNode").node)
    },

    showRuleView: function () {
        this.openView("prefabs/ruleView/RuleView")
    },

    onBtnShare: function () {
        var view = this.openView("prefabs/share/ShareView")
    },

    onBtnNotices: function () {
        var view = this.openView("prefabs/notice/noticeView")
    },

    requestResultData: function () {
        cc.log("请求上一局的结算数据")
        var data = { page: 1, uid: gUserData.uid }
        http.sendRequest("/game/room_record", data, function (ret) {
            cc.log(ret)
            cc.netMgr.exec(ret, function () {
                var lastResultData = ret.room_record_info_list[0]
                var view = this.openView("prefabs/totalResult/TotalResultView", this.find("totalResultNode").node)
                view.setTotalBattleRecordData(lastResultData)
            }.bind(this))
        }.bind(this))
    },

    //处理审核
    handleExamine: function () {
        if (!IS_EXAMINE) {
            return
        }
        // this.find("btnShop").active = false
        this.find("btnShare").active = false
        this.find("btnLog").active = false
    },

    //加载创建房间界面，主要是发送请求局数配置
    requestCreateRoomCfg: function () {
        var view = this.openView("prefabs/createRoom/CreateRoomView")
        view.hide()
    },

});
