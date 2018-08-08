var ProtoUtil = require("ProtoUtil");
var Code = require("Code");
// var EventName = require('EventName');
var CommonNetMgr = require('CommonNetMgr');
var GameToAppHelper = require("GameToAppHelper")
cc.Class({
    extends: cc.Component,

    properties: {
        gate: {
            get: function () {
                return this._commonNetMgr.gate;
            }
        },

        dataList: []
    },

    setIsReconnnect: function (isReconnect) {
        if (!this._commonNetMgr) {
            cc.log("_commonNetMgr closed");
            return
        }
        this._commonNetMgr.setIsReconnnect(isReconnect);
    },

    close: function (isReconnect) {
        if (!this._commonNetMgr) {
            cc.log("_commonNetMgr closed");
            return
        }
        if (isReconnect == false) {
            this.setIsReconnnect(false);
        }
        this._commonNetMgr.close();
        this._commonNetMgr = null;
    },

    // initData: function (uid, token, rid) {//初始化常用数据
    //     this._commonNetMgr = new CommonNetMgr();
    //     this._commonNetMgr.initData(uid, token, rid);
    // },

    initData: function () {//初始化常用数据
        this._commonNetMgr = new CommonNetMgr();
        this._commonNetMgr.initData();
    },

    reconnect: function (next) {

    },

    //应用退到后台
    onAppBack: function () {
        this.close(false)
    },

    //应用回到前台
    onAppFront: function () {
        cc.log("前台", this._commonNetMgr)
        if (null == this._commonNetMgr) {
            this.initData()
            this.login(this._loginBack)
        }
    },

    // 发送网络请求
    request: function (name, msg, cb) {
        if (!this._commonNetMgr) {
            cc.log("_commonNetMgr closed");
            return
        }
        this._commonNetMgr.request(name, msg, cb)
    },

    setLoginCallBack: function (next) {
        this._loginBack = next;
    },

    login: function (next) {
        // this._commonNetMgr = null;
        // var commonNetMgr = new CommonNetMgr();
        // commonNetMgr.init();
        var self = this;
        if (next) {
            this.setLoginCallBack(next);
        }
        this._commonNetMgr.login(function (socket, code) {
            if (socket) {
                self.initNetHandlers(socket);
                // self._commonNetMgr = commonNetMgr;
                if (self._loginBack) {
                    self._loginBack(true);
                }
                //next(true);
            } else {
                if (self._loginBack) {
                    self._loginBack(false, code);
                }
                // next(false,err);
                // console.log(err);
            }
        });
    },

    initNetHandlers: function (socket) {
        if (!socket) {
            // TODO:
            return;
        }
        // // TODO:监听网络消息，dispatch消息
        var self = this;
        //响应解散房间
        socket.on("on_room_close_launch", function (ret) {
            this.pushData("on_room_close_launch", ret, function () {
                console.log('on_room_close_launch:' + JSON.stringify(ret));
                if (2 == ret.type) {
                    //房主在解散房间时，直接返回到游戏大厅。
                    if (cc.gameMgr.isRoomOwner()) {
                        cc.gameMgr.backToLobbyScene()
                    }
                    //在房主解散房间时，其他玩家的页面里应该弹出“房主已解散房间”的提示，点击“确定”后返回到游戏大厅
                    else {
                        cc.common.showMsgBox({
                            type: 2, msg: "房主已解散房间", okCb: function () {
                                cc.gameMgr.backToLobbyScene()
                            }
                        })
                    }
                }
                else if (1 == ret.type) {
                    var view = cc.gameMgr.view.openView("prefabs/dismissRoom/DismissRoomView")
                    view.setData(ret.room_close_info)
                }
                else if (3 == ret.type) {
                    if (cc.gameMgr.curJushu <= 1) {
                        cc.common.showMsgBox({
                            type: 2, msg: "解散房间成功", okCb: function () {
                                cc.gameMgr.backToLobbyScene()
                            }
                        })
                    }
                    else {
                        cc.common.showMsgBox({
                            type: 2, msg: "解散房间成功", okCb: function () {

                            }
                        })
                    }
                }
            })
        }.bind(this))

        //解散房间玩家选择
        socket.on("on_room_close_affirm", function (ret) {
            this.pushData("on_room_close_affirm", ret, function () {
                console.log('on_room_close_affirm:', ret);
                cc.eventMgr.emit("on_room_close_affirm", ret)
            })
        }.bind(this))

        //响应离开房间
        socket.on("on_room_leave", function (ret) {
            this.pushData("on_room_leave", ret, function () {
                console.log('on_room_leave:', ret);
                cc.eventMgr.emit("on_room_leave", ret)
            })
        }.bind(this))

        //响应加入房间
        socket.on("on_room_join", function (ret) {
            this.pushData("on_room_join", ret, function () {
                console.log('on_room_join:', ret);
                cc.eventMgr.emit("on_room_join", ret)
            })
        }.bind(this))

        //踢出游戏(抢号)
        socket.on("on_user_kick", function (ret) {
            this.pushData("on_user_kick", ret, function () {
                console.log('on_user_kick:', ret);
                cc.common.showMsgBox({
                    type: 2, msg: "您的账号已在其它设备登录！", okCb: function () {
                        //this.close(false)
                        GameToAppHelper.ExitGame()
                    }
                })
                //cc.director.loadScene("LoginScene")
            }.bind(this))
        }.bind(this))

        //游戏状态变化
        socket.on("on_room_game_status_change", function (ret) {
            this.pushData("on_room_game_status_change", ret, function () {
                console.log('on_room_game_status_change:', ret);
                cc.eventMgr.emit("on_room_game_status_change", ret)
            })
        }.bind(this))

        //切牌
        socket.on("on_room_game_cut_cards", function (ret) {
            this.pushData("on_room_game_cut_cards", ret, function () {
                console.log('on_room_game_cut_cards:', ret);
                cc.eventMgr.emit("on_room_game_cut_cards", ret)
            })
        }.bind(this))

        //下注
        socket.on("on_room_game_betting", function (ret) {
            this.pushData("on_room_game_betting", ret, function () {
                console.log('on_room_game_betting:', ret);
                cc.eventMgr.emit("on_room_game_betting", ret)
            })
        }.bind(this))

        //发牌
        socket.on("on_room_game_send_cards", function (ret) {
            this.pushData("on_room_game_send_cards", ret, function () {
                console.log('on_room_game_send_cards:', ret);
                cc.eventMgr.emit("on_room_game_send_cards", ret)
            })
        }.bind(this))

        //补牌
        socket.on("on_room_game_mend_cards", function (ret) {
            this.pushData("on_room_game_mend_cards", ret, function () {
                console.log('on_room_game_mend_cards:', ret);
                cc.eventMgr.emit("on_room_game_mend_cards", ret)
            })
        }.bind(this))

        //比牌
        socket.on("on_room_game_compare_cards", function (ret) {
            this.pushData("on_room_game_compare_cards", ret, function () {
                console.log('on_room_game_compare_cards:', ret);
                cc.eventMgr.emit("on_room_game_compare_cards", ret)
            })
        }.bind(this))

        //挤牌翻开
        socket.on("on_room_game_squeeze_cards", function (ret) {
            this.pushData("on_room_game_squeeze_cards", ret, function () {
                console.log('on_room_game_squeeze_cards:', ret);
                cc.eventMgr.emit("on_room_game_squeeze_cards", ret)
            })
        }.bind(this))

        //挤牌位置同步
        socket.on("on_room_game_squeeze_cards_pos", function (ret) {
            this.pushData("on_room_game_squeeze_cards_pos", ret, function () {
                console.log('on_room_game_squeeze_cards_pos:', ret);
                cc.eventMgr.emit("on_room_game_squeeze_cards_pos", ret)
            })
        }.bind(this))

        //广播 开始挤牌
        socket.on("on_room_game_squeeze_cards_square", function (ret) {
            this.pushData("on_room_game_squeeze_cards_square", ret, function () {
                console.log('on_room_game_squeeze_cards_square:', ret);
                cc.eventMgr.emit("on_room_game_squeeze_cards_square", ret)
            })
        }.bind(this))

        //转让挤牌权
        socket.on("on_room_game_trans_permi", function (ret) {
            this.pushData("on_room_game_trans_permi", ret, function () {
                console.log('on_room_game_trans_permi:', ret);
                cc.eventMgr.emit("on_room_game_trans_permi", ret)
            })
        }.bind(this))

        //单局结算
        socket.on("on_settle_accounts_inning", function (ret) {
            this.pushData("on_settle_accounts_inning", ret, function () {
                console.log('on_settle_accounts_inning:', ret);
                cc.eventMgr.emit("on_settle_accounts_inning", ret)
            })
        }.bind(this))

        //中途结算
        socket.on("on_settle_accounts_midway", function (ret) {
            this.pushData("on_settle_accounts_midway", ret, function () {
                console.log('on_settle_accounts_midway:', ret);
                cc.eventMgr.emit("on_settle_accounts_midway", ret)
            })
        }.bind(this))

        //游戏总结算
        socket.on("on_settle_accounts_finish", function (ret) {
            this.pushData("on_settle_accounts_finish", ret, function () {
                console.log('on_settle_accounts_finish:', ret);
                cc.eventMgr.emit("on_settle_accounts_finish", ret)
            })
        }.bind(this))

        //聊天
        socket.on("on_room_chat", function (ret) {
            this.pushData("on_room_chat", ret, function () {
                console.log('on_room_chat:', ret);
                cc.eventMgr.emit("on_room_chat", ret)
            })
        }.bind(this))

        //清除下注
        socket.on("on_room_game_clear_bet", function (ret) {
            this.pushData("on_room_game_clear_bet", ret, function () {
                console.log('on_room_game_clear_bet:', ret);
                cc.eventMgr.emit("on_room_game_clear_bet", ret)
            })
        }.bind(this))

        //切牌位置同步
        socket.on("on_room_game_cut_cards_pos", function (ret) {
            this.pushData("on_room_game_cut_cards_pos", ret, function () {
                console.log('on_room_game_cut_cards_pos:', ret);
                cc.eventMgr.emit("on_room_game_cut_cards_pos", ret)
            })
        }.bind(this))

        //停止运营
        socket.on("on_room_game_stop_operations", function (ret) {
            this.pushData("on_room_game_stop_operations", ret, function () {
                console.log('on_room_game_stop_operations:', ret);
                cc.gameMgr.isForbidGame = true
                cc.common.showMsgBox({
                    type: 2, msg: "游戏停止运营，房间已解散", okCb: function () {
                        //第一局已结算，两个平台都屏蔽百家乐时，提示“游戏暂停运营，房间已解散”，点击确定弹出总结算，点击继续回到游戏大厅
                        if (cc.gameMgr.curJushu > 1) {
                            cc.gameMgr.view.openView("prefabs/totalResult/TotalResultView")
                        }
                        else {
                            cc.gameMgr.backToLobbyScene()
                        }
                    }
                })
                // if (!cc.gameMgr.view.isViewOnOpen("prefabs/totalResult/TotalResultView")) {
                //     cc.common.showMsgBox({
                //         type: 2, msg: "游戏停止运营，房间已解散", okCb: function () {
                //             GameToAppHelper.ExitGame()
                //         }
                //     })
                // }
                // else {
                //     cc.gameMgr.isForbidGame = true
                // }
            })
        }.bind(this))
    },

    //把协议缓存起来,因为游戏场景可能还没初始化成功，会丢失数据
    pushData: function (name, ret, cb) {
        this.dataList.push({ name: name, ret: ret, cb: cb })
    },

    //一帧处理一个
    handleData: function () {
        var data = this.dataList[0]
        if (data) {
            data.cb(data.name, data.ret)
            removeByIndex(this.dataList, 0)
        }
    },

    exec: function (ret, func) {
        if (ret.code == Code.OK) {
            func()
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
                cc.common.showMsgBox({ type: 1, msg: Code.getCodeName(ret.code), codeNumber: ret.code })
            }
        }
    }

});
