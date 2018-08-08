var BaseMgr = require("BaseMgr")
var CreateRoomConfig = require("CreateRoomConfig")
var GameToAppHelper = require("GameToAppHelper")
var self = null
var Code = require("Code")
var http = require("Http");

cc.Class({
    extends: BaseMgr,

    properties: {

    },

    // ctor: function () {
    //     this.view = arguments[0]
    // },

    onLoad: function () {

    },

    saveRuleData: function () {
        var ruleArr = this.view.node.getComponentsInChildren(cc.Toggle)
        var ruleData = []
        for (var i = 0; i < this.view.node.getComponentsInChildren(cc.Toggle).length; i++) {
            if (ruleArr[i].node.active && ruleArr[i].isChecked) {
                ruleData.push(ruleArr[i].name)
            }
        }
        cc.sys.localStorage.setItem("ruleData", JSON.stringify(ruleData))
        this.ruleData = ruleData
    },

    loadRuleData: function () {
        var ruleData = JSON.parse(cc.sys.localStorage.getItem('ruleData'))
        this.ruleData = ruleData
        if (!ruleData) {
            return
        }
        // cc.log(ruleData)
        var ruleArr = this.view.node.getComponentsInChildren(cc.Toggle)
        for (var i = 0; i < this.view.node.getComponentsInChildren(cc.Toggle).length; i++) {
            if (-1 != ruleData.indexOf(ruleArr[i].name)) {
                ruleArr[i].isChecked = true
            }
            else {
                ruleArr[i].isChecked = false
            }
        }
    },

    //读取后台配置的数据
    loadPhpData: function () {
        var createType = 1
        if ((gUserData.dingdingData.gameData && gUserData.dingdingData.gameData.groupId) || gUserData.testGroup_id != 0) {
            if (gUserData.dingdingData.gameData && gUserData.dingdingData.gameData.groupId) {
                cc.log("是否群房间", gUserData.dingdingData.gameData.groupId)
            }
            createType = 3
        }

        http.sendRequest("/game/room_settings", {type : createType}, function (ret, status) {
            cc.log("/game/room_settings", ret, JSON.stringify(ret))
            cc.netMgr.exec(ret, function () {
                var toggleJuShu = this.view.find("toggleJuShu")
                toggleJuShu.toggle1.active = false
                toggleJuShu.toggle2.active = false
                toggleJuShu.toggle3.active = false
                var isXianMianOpen = true //全部局数选项都是免费时，显示限免开放
                cc.log("toggle!!!", ret.data.length)
                for (var i = 0; i < ret.data.length; i++) {
                    var element = ret.data[i]
                    cc.log(toggleJuShu["toggle" + (i + 1)], "toggle" + (i + 1))
                    var toggle = toggleJuShu["toggle" + (i + 1)]
                    toggle.active = true
                    // if (element.tag == "") {
                    //     element.tag = "体验局"
                    // }
                    toggle.phpData = ret.data[i]
                    if (0 == element.room_card) {
                        this.view.find("richText" + (i + 1)).string = "<color=#ffffff>" + element.game_num + "局(限时免费)"
                    }
                    else {
                        this.view.find("richText" + (i + 1)).string = "<color=#ffffff>" + element.game_num + "局(" + element.tag + "<img src=\"btn_roomcard\"/><color=#0fffff>x" 
                        + element.room_card + ")</color>"
                        isXianMianOpen = false
                        // <color=#00ff00>Ri<img src="emoji1" click="clickme"/><u>c
                        // h</u></c><color=#0fffff><size=77>Te</s><img src="emoji2" />x
                        // t</color><img src="emoji3" />
                        // <color=#ffffff>20局(<img src="btn_jewel"/><color=#0fffff>x5)</color>
                    }
                }
                this.view.find("btnFreeCreate").active = isXianMianOpen
                //当toggle隐藏的时候，会自动选中其他没隐藏的toggle，所以导致选中的toggle不正确，这里重新选中一下
                if (this.ruleData) {
                    this.view.find(this.ruleData[0].substring(0, 7)).getComponent(cc.Toggle).isChecked = true
                }
            }.bind(this))
        }.bind(this))
    },

    requestCreateRoom: function () {
        cc.sceneNode.js.showLoadingView()
        this.saveRuleData()
        this.view.hide()
        self = this
        var ruleData = this.ruleData
        var cfg = {}
        for (var index = 0; index < ruleData.length; index++) {
            if (ruleData[index] == "toggle1<Toggle>" || ruleData[index] == "toggle2<Toggle>" || ruleData[index] == "toggle3<Toggle>") {
                cfg["jushu"] = ruleData[index]
            }
            else if (ruleData[index] == "toggle7<Toggle>" || ruleData[index] == "toggle8<Toggle>") {
                cfg["yazhu"] = ruleData[index]
            }
            else if (ruleData[index] == "toggle5<Toggle>" || ruleData[index] == "toggle6<Toggle>") {
                cfg["jipai"] = ruleData[index]
            }
            else if (ruleData[index] == "toggle4<Toggle>") {
                cfg["jiaru"] = ruleData[index]
            }
        }
        // cc.log(JSON.stringify(cfg))
        var roomParams = CreateRoomConfig.roomParams
        var http = require("Http")
        var low_bet
        var hig_bet
        if (1 == roomParams.yazhu[cfg.yazhu]) {
            low_bet = 1
            hig_bet = 1000
        }
        else {
            low_bet = 10
            hig_bet = 10000
        }
        // cc.log("-----" ,cfg.jushu.substring(0, 7), this.view.find(cfg.jushu.substring(0, 7)))
        var phpData = this.view.find(cfg.jushu.substring(0, 7)).phpData
        var room_setup_info = {
            inning_num: phpData.game_num,
            room_card: phpData.room_card,
            id: phpData.id,
            name: phpData.name,
            tag: phpData.tag,
            low_bet : low_bet,
            hig_bet : hig_bet,
            midway_join: roomParams.jiaru[cfg.jiaru] || 2, squeeze_cards: roomParams.jipai[cfg.jipai],
            group_id : 0,
            type : 1,
        }
        cc.log(room_setup_info)
        var group_id = null
        if (gUserData.dingdingData.gameData) {
            cc.log("群ID", gUserData.dingdingData.gameData.groupId)
            group_id = gUserData.dingdingData.gameData.groupId
            //百家乐还没俱乐部功能，策划说要在丁丁俱乐部进入当群进入
            // if (gUserData.dingdingData.gameData.clubId != 0) {
            //     group_id = gUserData.dingdingData.gameData.clubId
            // }
            // cc.log("俱乐部id", gUserData.dingdingData.gameData.clubId)
            room_setup_info.group_id = group_id || 0
            cc.log("group_id", room_setup_info.group_id)
        }
        else if (gUserData.testGroup_id != 0) {
            room_setup_info.group_id = gUserData.testGroup_id
        }
        if (room_setup_info.group_id == 0) {
            room_setup_info.type = 1
        }
        else {
            room_setup_info.type = 3
        }
        var data = { uid: gUserData.uid, room_setup_info: room_setup_info , }
        if (this.isSendRequest) {
            return
        }
        this.isSendRequest = true
        http.sendRequest("/game/create_room", data, function (ret) {
            cc.log(ret)
            //在丁丁的其他游戏中
            if (Code.USER_ALREAY_IN_OTHER_GAME == ret.code) {
                cc.common.showMsgBox({type: 2, msg: "您正在游戏中", okCb: function () {
                        
                    }})
                cc.sceneNode.js.hideLoadingView()
                return
            }
            if (Code.ROOM_CONFIG_CHANGE == ret.code) {
                cc.common.showMsgBox({type: 2, msg: "房间配置有更变，请重启游戏", okCb: function () {
                        GameToAppHelper.ExitGame()
                    }})
                cc.sceneNode.js.hideLoadingView()
                return
            }
            if (Code.ROOM_CARD_NOT_FULL == ret.code) {
                cc.common.showMsgBox({type: 2, msg: "房卡数量不足", okCb: function () {
                        
                    }})
                cc.sceneNode.js.hideLoadingView()
                return
            }
            if (ret.err == "DIAMOND_NOT_FULL"){    //钻石不足创建失败
                cc.common.showMsgBox({
                    type: 2, msg: "钻石不足，请充值！", okCb: function () {
                        cc.sceneNode.js.openView("prefabs/mall/mallView")
                    }
                    , chongZhi: true})
                cc.sceneNode.js.hideLoadingView()
                return
            }
            if (Code.ROOM_NOT_PERMISSION == ret.code){
                cc.common.showMsgBox({type: 2, msg: "无权限加入,请联系群主", okCb: function () {
                        
                }})
                cc.sceneNode.js.hideLoadingView()
                return
            }
            if (ret.code != Code.OK) {
                cc.sceneNode.js.hideLoadingView()
            }
            cc.netMgr.exec(ret, function () {
                // gUserData.roomInfo.rid = ret.
                gUserData.roomInfo = ret

                cc.sys.localStorage.setItem("roomId", JSON.stringify(ret.rid))
                self.requestJoin(ret.rid)
            })
        });
    },

    //创建房间后手动加入房间
    requestJoin: function (rid) {
        setTimeout(function () {
            cc.netMgr.request("room_join", { rid: rid , gid : 0}, function (ret) {
                cc.netMgr.exec(ret, function () {
                    // gUserData.roomInfo.rid = rid
                    cc.log(ret)
                    gUserData.roomInfo = ret.room_info
                    GameToAppHelper.shareCreateClubGame()
                    cc.director.loadScene("GameScene")
                }.bind(this))
            }.bind(this))
        }.bind(this), 10)
    },

    //检查屏蔽游戏，两个平台都屏蔽时，不能游戏
    checkForbidGame: function (forbidCb, normalCb) {
        //IOS
        http.sendRequest("/game/fetch_shields", { system: 1 }, function (ret, status) {
            cc.log(ret)
            if (1 == ret.data.disGame_baijiale) {
                normalCb()
                return false
            }
            //android
            http.sendRequest("/game/fetch_shields", { system: 2 }, function (ret, status) {
                cc.log(ret)
                if (1 == ret.data.disGame_baijiale) {
                    normalCb()
                    return false
                }
                else {
                    forbidCb()
                    return true;
                }
            }.bind(this))
        }.bind(this))
    },
});
