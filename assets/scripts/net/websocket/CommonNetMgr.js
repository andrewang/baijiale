var ProtoUtil = require("ProtoUtil");
var Code = require("Code");
var Socket = require('Socket');
var GameToAppHelper = require("GameToAppHelper")
cc.Class({
    extends: cc.Component,

    properties: {
        gate: null,
        _connectTime: 0,
        _heatbeat: 5,//从服务端获取
        maxConnectTime: 2,
        reconnectSecond: 0,
        maxReconnectSecond: 5,
        // isReconnect: true,
        isReconnect: gIsReconnect,
    },

    setIsReconnnect: function (isReconnect) {//长链接断开时是否自动重新连接
        this.isReconnect = isReconnect;
    },

    getSocket: function () {
        return this.socket;
    },

    init: function () {
        //this.__instanceId = cc.ClassManager.getNewInstanceId();
    },

    initData: function () {//初始化常用数据

    },

    close: function () {//关闭长链接
        cc.log("111?????&&&&&", this.connectCb)
        if (this.connectCb) {
            cc.director.getScheduler().unschedule(this.connectCb, this);
            this.connectCb = null
        }
        if (!this.socket) {
            return
        }
        this.socket.close();
        this.socket = null;
        this.stopHeatBeat();
    },
    //重新连接
    reconnect: function (next) {
        this.reconnectCb = next
        if (!this.isReconnect) {
            console.log("不重连");
            return;
        }
        // if ((this._connectTime++) > this.maxConnectTime) {
        //     this._connectTime = 0;
        //     //cc.global.rootNode.emit('RequestReconnect');
        // } else {
            
        // }
        this.reconnectSecond = this.reconnectSecond > this.maxReconnectSecond ? this.maxReconnectSecond : this.reconnectSecond;
        console.log(this.reconnectSecond + '秒后重新连接');
        //cc.global.loading.show();
        var self = this;
        if (this.connectCb) {
            cc.director.getScheduler().unschedule(this.connectCb, this);
            this.connectCb = null
        }
        this.showMsgBoxConnectCb = function () {
            cc.common.showMsgBox({
                type: 2, msg: "网络连接失败，请重试！", okCb: function () {
                    self.login(self.reconnectCb);
                    cc.sceneNode.js.showLoadingView()
                }
            })
        }
        // this.connectCb = function () {
        //     cc.log('正在重新连接');

        // }
        cc.director.getScheduler().unschedule(this.showMsgBoxConnectCb, this);
        cc.director.getScheduler().schedule(this.showMsgBoxConnectCb, this, 0, 0, this.reconnectSecond, false);
        this.reconnectSecond += 5;
    },
    //开始发送心跳，不可外部调用
    startHeartBeat: function () {
        var self = this;
        this.heatBeatCallBack = function () {
            var msg = {};
            console.log('发送心跳');
            self.request("user_heartbeat", msg, function () { });
        };
        cc.director.getScheduler().unschedule(this.heatBeatCallBack, this);
        var interval = this._heatbeat;
        // cc.director.getScheduler().schedule(this.heatBeatCallBack, this, interval, cc.macro.REPEAT_FOREVER, 0, false)
        cc.director.getScheduler().schedule(this.heatBeatCallBack, this, 5)
    },
    //停止发送心跳，不可外部调用
    stopHeatBeat: function () {
        this.unschedule(this.heatBeatCallBack);
    },

    // 发送网络请求
    request: function (name, msg, cb) {
        if (!this.socket) {
            cc.log("socket closed");
            return
        }
        this.socket.request(name, msg, cb)
    },

    //首先会进行一次http请求获取真正的gate地址，然后才进行长连接
    login: function (next) {//next(socket,code)
        // console.log('login');
        // this.initData();
        var self = this;
        var socket = new Socket();

        var onError = function (err) {
            cc.log("connect error %s", JSON.stringify(err));
        }

        var onClose = function () {
            cc.log("connect close");
            self.stopHeatBeat();
            self.socket = null;
            if (this.isReconnect) {
                self.reconnect(next);
            }
        }.bind(this)

        var onOpen = function () {
            cc.log("connect success");

            //WS 验证
            var msg = { uid: gUserData.uid, token: gUserData.dingdingData.uToken };
            socket.request("user_auth", msg, function (ret) {
                cc.log(ret)
                cc.log("user_auth ret %s", JSON.stringify(ret));
                // if (ret.code != Code.OK || !ret.player) {
                if (ret.code != Code.OK) {
                    cc.common.showMsgBox({
                        type: 2, msg: "用户验证失败", okCb: function () {
                            GameToAppHelper.ExitGame()
                        }
                    })
                    return next(null, ret.code);
                }
                cc.sceneNode.js.hideLoadingView()
                self.socket = socket;
                self.reconnectSecond = 0;
                self._heatbeat = ret.heartbeat;
                gUserData.playerInfo = ret.user_base_info
                //玩家中途离线，获取结算信息
                if (1 == ret.is_waybill_online_and_exit_game) {
                    cc.eventMgr.emit("requestResultData")
                }
                next(socket);
                //暂时屏蔽
                self.startHeartBeat();
            })
        }.bind(this)

        var msg = { uid: gUserData.uid, token: gUserData.dingdingData.uToken };
        var http = require("Http");

        http.sendRequest("/gate/host_info", msg, function (ret, status) {
            if (ret != null) {
                if (Code.isSuc(ret.code)) {
                    self.gate = ret;
                    socket.connect(self.gate.ws);
                    socket.on("onopen", onOpen);
                    socket.on("onclose", onClose);
                    socket.on("onerror", onError);
                } else {
                    return next(null, ret.code);
                }
            } else {
                // console.log(status);
                self.reconnect(next);
            }
        });
    },

    //获取游戏服务器地址
    getGameServerIp: function () {
        if (this.gate) {
            return "http://" + this.gate.ip + ":" + this.gate.port
        }
    },
});
