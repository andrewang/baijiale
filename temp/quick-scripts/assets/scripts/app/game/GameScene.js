(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/game/GameScene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'aa9d0TBYXJEKYSCkyVs0/Ok', 'GameScene', __filename);
// scripts/app/game/GameScene.js

"use strict";

var BaseScene = require("BaseScene");
var GameToAppHelper = require("GameToAppHelper");
//客户端下注的名字对应服务端的数据类型
var betState = {};
betState["x1"] = 2;
betState["z1"] = 1;
betState["h"] = 3;
betState["xd"] = 5;
betState["zd"] = 4;

var clientBetState = require("GameConfig").clientBetState;
var clientCardIndex = require("GameConfig").clientCardIndex;
var stateEnmu = require("GameConfig").stateEnmu;
var record = require("RecordMgr");
// var recordMgr = new record
var recordMgr = record.create();

cc.Class({
    extends: BaseScene,
    properties: {
        moduleName: {
            override: true,
            default: "Game",
            visible: false
        },
        cardList: {
            default: []
        },
        isCanSendCutCards: true
    },

    onLoad: function onLoad() {
        this._super();

        cc.musicMgr.stopLobbyBgm();
        this.initView();
        this.initListener();
        this.initAniEvent();
    },

    initView: function initView() {
        for (var i = 0; i <= 9; i++) {
            this.find("player" + i).js = this.find("player" + i).getComponent("Player");
            this.find("player" + i).js.init(i);
            this["player" + i] = this.find("player" + i);
        }

        //筹码初始化
        var chipList = [];
        chipList[1] = 1;
        chipList[2] = 5;
        chipList[3] = 10;
        chipList[4] = 50;
        chipList[5] = 100;
        this.nodeRecordVoice = this.find("nodeRecordVoice");
        this.node_quanxian_xian = this.find("node_quanxian_xian").node;
        this.node_quanxian_zhuang = this.find("node_quanxian_zhuang").node;
        this.pos_quanxian_xian = this.node_quanxian_xian.position;
        this.pos_quanxian_zhuang = this.node_quanxian_zhuang.position;
        this.xianScore = this.find("xianScore");
        this.zhuangScore = this.find("zhuangScore");
        this.btnFlipXian = this.find("btnFlipXian");
        this.btnFlipZhuang = this.find("btnFlipZhuang");
        this.light_xian = this.find("light_xian");
        this.light_zhuang = this.find("light_zhuang");
        this.light_he = this.find("light_he");
        this.txtZhuangTotalBetNum = this.find("txtZhuangTotalBetNum");
        this.txtXianTotalBetNum = this.find("txtXianTotalBetNum");
        this.txtHeTotalBetNum = this.find("txtHeTotalBetNum");
        this.txtZhuangduiTotalBetNum = this.find("txtZhuangduiTotalBetNum");
        this.txtXianduiTotalBetNum = this.find("txtXianduiTotalBetNum");
        this.nodeChip1 = this.find("nodeChip1");
        this.nodeChip2 = this.find("nodeChip2");
        this.he = this.find("he");
        this.zhuangdui = this.find("zhuangdui");
        this.xiandui = this.find("xiandui");
        for (var i = 1; i <= 9; i++) {
            this["zhuang" + i] = this.find("zhuang" + i);
            this["xian" + i] = this.find("xian" + i);
        }

        this.nodeRecordVoice.active = false;
        this.nodeChip1.active = false;
        this.nodeChip2.active = false;
        this.find("nodeCardPos").active = true;

        for (var i = 0; i <= 9; i++) {
            var node = this.find("nodeJi" + i);
            if (node) {
                node.active = false;
            }
        }
        this.find("fapaiqi").setLocalZOrder(50);
        this.zhuangThanCardEffect = this.find("zhuangThanCardEffect");
        this.xianThanCardEffect = this.find("xianThanCardEffect");
        this.zhuangCardParticle = this.find("zhuangCardParticle");
        this.xianCardParticle = this.find("xianCardParticle");

        this.yingPaiEffect = this.find("yingPaiEffect");

        // this._zhuangFirstPos = this.find("zhuangYingPaiEffect").position
        // this._zhuangCompareCardPos = this.find("zhuangCompareCard").position

        // this._xianFirstPos = this.find("xianYingPaiEffect").position
        // this._xianCompareCardPos = this.find("xianCompareCard").position

        this.reset();
        this.handleExamine();
    },

    initAniEvent: function initAniEvent() {
        this.find("aniXiandui").getComponent(cc.Animation).on('stop', function () {
            this.find("aniXiandui").active = false;
        }, this);
        this.find("aniZhuangdui").getComponent(cc.Animation).on('stop', function () {
            this.find("aniZhuangdui").active = false;
        }, this);
    },

    reset: function reset() {
        for (var i = 0; i <= 9; i++) {
            // this.find("player" + i).reset()
            this["player" + i].reset();
        }
        for (var i = 1; i <= 6; i++) {
            this.find("posCard" + i).node.active = false;
        }
        this.find("pokerDiscard").active = false;
        this.find("cutPoker").active = false;

        //6张牌
        for (var i = 1; i <= 6; i++) {
            var card = this.cardList[i];
            if (!card) {
                card = cc.instantiate(cc.res["prefabs/card/Card"]);
                this.cardList[i] = card;
                card.parent = this.find("nodeCardPos");
            }
            card.position = this.find("posCard0").node.position;
            if (card.js) {
                card.js.reset();
                card.js.showBack();
                card.active = false;
            } else {
                card.onLoadCb = function (js) {
                    js.reset();
                    js.showBack();
                    js.node.active = false;
                };
            }
        }

        this.node_quanxian_xian.getComponent("PowerObj").reset();
        this.node_quanxian_zhuang.getComponent("PowerObj").reset();

        this.find("xian1").txtNum.node.active = false;
        this.find("zhuang1").txtNum.node.active = false;
        this.find("xiandui").txtNum.node.active = false;
        this.find("zhuangdui").txtNum.node.active = false;
        this.find("he").txtNum.node.active = false;
        this.find("aniXiandui").active = false;
        this.find("aniZhuangdui").active = false;
        this.xianScore.node.active = false;
        this.zhuangScore.node.active = false;

        // this.find("xianYingPaiEffect").position = this._xianFirstPos
        // this.find("zhuangYingPaiEffect").position = this._zhuangFirstPos
        this.yingPaiEffect.active = false;
    },

    initListener: function initListener() {
        //初始化切牌监听
        var self = this;
        var cutCtrlNode = this.find("cutControl");
        cutCtrlNode.on(cc.Node.EventType.TOUCH_MOVE, function (touch) {
            if (!this.mgr.isRoomOwner()) {
                return;
            }
            this.find("arrows").active = false;
            var pos = cutCtrlNode.parent.convertTouchToNodeSpaceAR(touch);
            if (pos.x <= 240 && pos.x >= -240) {
                cutCtrlNode.position = { x: pos.x, y: cutCtrlNode.position.y };
                cutCtrlNode.scaleX = pos.x / 240;
                //发送同步位置
                if (this.isCanSendCutCards) {
                    this.isCanSendCutCards = false;
                    cc.netMgr.request("room_game_cut_cards_pos", { pos: cutCtrlNode.position }, function (ret) {
                        cc.netMgr.exec(ret, function () {});
                    });

                    scheduleTimeOut(function () {
                        this.isCanSendCutCards = true;
                    }.bind(this), this, 0.01);
                }
            }
        }, this);
        cutCtrlNode.on(cc.Node.EventType.TOUCH_START, function () {}, this);

        var requestCutCards = function (touch) {
            if (!this.mgr.isRoomOwner()) {
                return;
            }
            var pos = cutCtrlNode.parent.convertTouchToNodeSpaceAR(touch);
            var x = pos.x;
            x = Math.min(x, 240);
            x = Math.max(x, -240);
            self.mgr.reqCutCards({ pos: x });
        }.bind(this);

        cutCtrlNode.on(cc.Node.EventType.TOUCH_END, function (touch) {
            requestCutCards(touch);
        }, this);
        cutCtrlNode.on(cc.Node.EventType.TOUCH_CANCEL, function (touch) {
            requestCutCards(touch);
        }, this);

        function betListener(touch) {
            cc.log(touch.currentTarget._name);
            if (this.mgr.isRoomOwner() || stateEnmu.BETTING != gUserData.roomInfo.game_status && stateEnmu.BETTING_DELAY != gUserData.roomInfo.game_status) {
                return;
            }

            var selectChip = this.getSelectChip();
            var state = betState[touch.currentTarget._name];
            this.mgr.reqBet({ state: state, jetton: Number(selectChip.value.string) });

            //test 下注测试
            // this.testBet()
        }
        this.find("x1").node.on(cc.Node.EventType.TOUCH_END, betListener, this);
        this.find("z1").node.on(cc.Node.EventType.TOUCH_END, betListener, this);
        this.find("xd").node.on(cc.Node.EventType.TOUCH_END, betListener, this);
        this.find("zd").node.on(cc.Node.EventType.TOUCH_END, betListener, this);
        this.find("h").node.on(cc.Node.EventType.TOUCH_END, betListener, this);

        //录音
        var btn_voice = this.find("btn_voice");
        btn_voice.on(cc.Node.EventType.TOUCH_START, function () {
            cc.log("TOUCH_START");
            this.nodeRecordVoice.active = true;
            this.nodeRecordVoice.node1.active = true;
            this.nodeRecordVoice.node2.active = false;
            this.nodeRecordVoice.node1.getChildByName("ani").getComponent(cc.Animation).play();
            recordMgr.startRecord();
        }, this);
        btn_voice.on(cc.Node.EventType.TOUCH_END, function () {
            cc.log("TOUCH_END");
            this.nodeRecordVoice.active = false;
            this.nodeRecordVoice.node1.getChildByName("ani").getComponent(cc.Animation).stop();
            recordMgr.tryToStopRecord(1);
        }, this);
        btn_voice.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            cc.log("TOUCH_CANCEL");
            this.nodeRecordVoice.active = false;
            this.nodeRecordVoice.node1.getChildByName("ani").getComponent(cc.Animation).stop();
            recordMgr.tryToStopRecord(0);
        }, this);
        btn_voice.on(cc.Node.EventType.TOUCH_MOVE, function (touch) {
            this.nodeRecordVoice.active = true;
            var pos = btn_voice.parent.convertTouchToNodeSpaceAR(touch);
            if (Math.abs(pos.y - btn_voice.position.y) >= btn_voice.getContentSize().height / 2) {
                this.nodeRecordVoice.node1.active = false;
                this.nodeRecordVoice.node2.active = true;
            } else {
                this.nodeRecordVoice.node1.active = true;
                this.nodeRecordVoice.node2.active = false;
            }
        }, this);

        //进入后台 
        this.eventHideListener = cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function (event) {
            cc.log("进入后台");
            if (this.isNeedReconnect()) {
                cc.audioEngine.stopAll();
                cc.netMgr.onAppBack();
            }
        }.bind(this));
        // //恢复显示 
        this.eventShowListener = cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function (event) {
            cc.log("进入前台");
            if (this.isNeedReconnect()) {
                cc.netMgr.onAppFront();
            }
        }.bind(this));
    },

    //重连条件（分享的时候进入前台不需重连）
    isNeedReconnect: function isNeedReconnect() {
        return !(this.isViewOnOpen("prefabs/share/ShareView2") || this.isViewOnOpen("prefabs/share/ShareView"));
    },

    //设置切牌杆位置
    setCutControlPos: function setCutControlPos(pos) {
        var cutCtrlNode = this.find("cutControl");
        cutCtrlNode.position = pos;
        cutCtrlNode.scaleX = pos.x / 240;
    },

    start: function start() {
        this._super();
        this.setRoomInfo();
        var self = this;

        // this.find("nodeBtnOwner").active = false
        // this.find("nodeBtnPlayer").active = false

        //发牌test
        // var ret = {}
        // ret.player_cards_list = []
        // ret.banker_cards_list = []
        // ret.player_cards_list.push({cards : 13, type : 3})
        // ret.player_cards_list.push({cards : 13, type : 3})
        // ret.banker_cards_list.push({cards : 13, type : 3})
        // ret.banker_cards_list.push({cards : 13, type : 3})
        // this.dealCards(ret)

        // //补牌test
        // setTimeout(function () {
        //     var ret = {}
        //     ret.player_mend_cards = {cards : 13, type : 3}
        //     ret.banker_mend_cards = {cards : 13, type : 3}
        //     self.buCards(ret)
        // }, 4000)

        //挤牌test
        // setTimeout(function () {
        //     self.handleSqueeze({state : 2})
        // }, 2500)
        // setTimeout(function () {
        //     self.buCardsTest()
        // }, 4000)


        // var card = cc.instantiate(cc.res["prefabs/card/Card"])
        // card.parent = this.node
        // card.js.setSqueeze(false)
        // this.testCard = card
    },

    //按照闲庄闲庄顺序发牌
    dealCards: function dealCards(ret) {
        // this.find("txtLeftCardsNum").string = "剩牌数:" + ret.surplus_cards
        var serverCardList = [];
        serverCardList.push(clone(ret.player_cards_list[0]));
        serverCardList.push(clone(ret.player_cards_list[1]));
        serverCardList.push(clone(ret.banker_cards_list[0]));
        serverCardList.push(clone(ret.banker_cards_list[1]));
        var secCfg = [];
        secCfg[1] = 0.7;
        secCfg[2] = 2.1;
        secCfg[3] = 1.4;
        secCfg[4] = 2.8;
        for (var i = 1; i <= 4; i++) {
            // var self = this
            var card = this.cardList[i];
            card.active = true;
            card.js.setData(serverCardList[i - 1], i);
            card.setRotation(58); //发牌器是旋转的，扑克也要旋转
            var handle = function (card, i) {
                scheduleTimeOut(function () {
                    if (1 == i || 2 == i) {
                        cc.musicMgr.playEffect("send_card_xian.mp3");
                    } else {
                        cc.musicMgr.playEffect("send_card_zhuang.mp3");
                    }
                    card.js.dealMove(this.find("posCard" + i).node.position, function () {
                        this.setLeftCardNum(this.leftCardNum - 1);
                    }.bind(this));
                }.bind(this), this, secCfg[i]);
            }.bind(this);
            handle(card, i);
        }
    },

    //补牌
    buCards: function buCards(ret) {
        var serverCardList = [];
        serverCardList.push(clone(ret.player_mend_cards));
        serverCardList.push(clone(ret.banker_mend_cards));
        var secCfg = [];
        secCfg[5] = 0.7;
        secCfg[6] = 1.4;
        for (var i = 5; i <= 6; i++) {
            var card = this.cardList[i];
            if (serverCardList[i - 5]) {
                card.active = true;
                card.js.setData(serverCardList[i - 5], i);
                card.setRotation(58); //发牌器是旋转的，扑克也要旋转
                var handle = function (card, i) {
                    scheduleTimeOut(function () {
                        if (5 == i) {
                            cc.musicMgr.playEffect("bu_card_xian.mp3");
                            this.cardList[2].js.move(this.find("dieposCard2").node.position);
                        } else {
                            cc.musicMgr.playEffect("bu_card_zhuang.mp3");
                            this.cardList[4].js.move(this.find("dieposCard4").node.position);
                        }
                        card.js.dealMove(this.find("posCard" + i).node.position, function () {
                            this.setLeftCardNum(this.leftCardNum - 1);
                        }.bind(this));
                    }.bind(this), this, secCfg[i]);
                }.bind(this);
                handle(card, i);
            }
        }
    },

    //获取翻开的牌的总点数 1庄 2闲
    getCardTotalPoint: function getCardTotalPoint(who) {
        var list = [];
        if (1 == who) {
            list.push(this.cardList[3]);
            list.push(this.cardList[4]);
            list.push(this.cardList[6]);
        } else {
            list.push(this.cardList[1]);
            list.push(this.cardList[2]);
            list.push(this.cardList[5]);
        }
        var point = 0;
        //只计算已经翻开的牌
        for (var i = 0; i < list.length; i++) {
            var card = list[i];
            if (card.js.isFront() && card.js.getCardNum() < 10) {
                point += card.js.getCardNum();
            }
        }
        return point % 10;
    },

    //获取牌的总点数 1庄 2闲
    newGetCardTotalPoint: function newGetCardTotalPoint(who) {
        var list = [];
        if (1 == who) {
            list.push(this.cardList[3]);
            list.push(this.cardList[4]);
            list.push(this.cardList[6]);
        } else {
            list.push(this.cardList[1]);
            list.push(this.cardList[2]);
            list.push(this.cardList[5]);
        }
        var point = 0;
        for (var i = 0; i < list.length; i++) {
            var card = list[i];
            if (card.js.getCardNum() < 10) {
                point += card.js.getCardNum();
            }
        }
        return point % 10;
    },

    showScore: function showScore() {
        var isFlip = function (who) {
            var list = [];
            //庄
            if (1 == who) {
                list.push(this.cardList[3]);
                list.push(this.cardList[4]);
                list.push(this.cardList[6]);
            } else {
                list.push(this.cardList[1]);
                list.push(this.cardList[2]);
                list.push(this.cardList[5]);
            }
            for (var i = 0; i < list.length; i++) {
                var card = list[i];
                if (card.js.isFront()) {
                    return true;
                }
            }
            return false;
        }.bind(this);

        var xPoint = this.getCardTotalPoint(2);
        var zPoint = this.getCardTotalPoint(1);
        this.xianScore.string = xPoint;
        this.zhuangScore.string = zPoint;
        this.xianScore.node.active = isFlip(2);
        this.zhuangScore.node.active = isFlip(1);
    },

    //获取要挤牌的卡，返回数组.1庄2闲
    getNotOpenCard: function getNotOpenCard(ret) {
        var notOpenCardList = [];
        for (var i = 0; i < ret.unopen_cards_list.length; i++) {
            var index = clientCardIndex[ret.state][ret.unopen_cards_list[i]];
            notOpenCardList.push(this.cardList[index]);
        }
        return notOpenCardList;
    },

    //处理挤牌
    handleSqueeze: function handleSqueeze(ret) {
        var self = this;
        var notOpenCardList = this.getNotOpenCard(ret);

        var isMyJipai = function () {
            return cc.gameMgr.curJipaiPlayerUid == cc.gameMgr._myData.user_base_info.uid;
        }.bind(this);

        var getJiNode = function (uid) {
            var getPos = function () {
                var player = this.getPlayerByUid(uid);
                var seatId = player.getClientSeatId();
                return this.find("nodeJi" + seatId);
            }.bind(this);

            if (this.mgr.isRoomOwner()) {
                var player = this.getPlayerByUid(uid);
                var seatId = player.getClientSeatId();
                if (seatId == 1) {
                    return this.find("nodeJi0");
                }
                return getPos();
            } else {
                return getPos();
            }
        }.bind(this);
        scheduleTimeOut(function () {
            if (1 == notOpenCardList.length) {
                if (isMyJipai()) {
                    notOpenCardList[0].js.moveToSqueeze({ x: 0, y: 0 });
                } else {
                    var nodeJi = getJiNode(cc.gameMgr.curJipaiPlayerUid);
                    notOpenCardList[0].js.moveToSqueeze(nodeJi.posJi1.node.position);
                }
            }
            if (2 == notOpenCardList.length) {
                var nodeJi = getJiNode(cc.gameMgr.curJipaiPlayerUid);
                notOpenCardList[0].js.moveToSqueeze(nodeJi.posJi1.node.position);
                notOpenCardList[1].js.moveToSqueeze(nodeJi.posJi2.node.position);
            }
        }.bind(this), this, 0.1);
    },

    //判断是否有一张牌在挤牌完成移动中（因为挤完牌会有一个移动的过程，这个时候后端通知另一边要挤牌，需要等移动回调再执行）
    isExitOneCardOnMove: function isExitOneCardOnMove() {
        for (var i = 1; i <= 6; i++) {
            if (this.cardList[i].js.isNeedJi() || this.cardList[i].js.isOnFlip()) {
                return true;
            }
        }
        return false;
    },

    setRoomInfo: function setRoomInfo() {
        // this.find("txtRoomId").string = "房间id：" + gUserData.roomInfo.rid
        this.find("txtRoomId").string = "房间号：" + gUserData.roomInfo.room_num;
        this.mgr.setJushu(gUserData.roomInfo.inning_count);
        var playerDataList = gUserData.roomInfo.seat_info_list;
        //设置房主UI
        this.mgr.setRoomOwner({ seat: 0, user_base_info: clone(gUserData.roomInfo.owner_base_info) });
        if (!this.mgr.isRoomOwner()) {
            this.find("nodeTotalBetNum").active = false;
            this.find("arrows").active = false;
        } else {
            this.find("nodeTotalBetNum").active = true;
            this.find("arrows").active = true;
        }

        this.mgr.setPlayerDatas(clone(playerDataList));
        for (var i = 0; i < gUserData.roomInfo.user_win_total_list.length; i++) {
            var user_profit = gUserData.roomInfo.user_win_total_list[i];
            var player = this.getPlayerByUid(user_profit.uid);
            player.setGoldNum(user_profit.win_jetton);
        }
        this.find("player0").setGoldNum(gUserData.roomInfo.owner_win_total);

        if ("wait" == gUserData.roomInfo.room_status) {
            this.find("nodeBtnOwner").active = this.mgr.isRoomOwner();
            this.find("nodeBtnPlayer").active = !this.mgr.isRoomOwner();
            this.find("start_bg").node.active = true;
        } else {
            this.find("nodeBtnOwner").active = false;
            this.find("nodeBtnPlayer").active = false;
            this.find("start_bg").node.active = false;
        }
        // if (1 == gUserData.roomInfo.room_setup_info.bet_limit_type) {
        //     this.find("txtMaxBetNum").string = "最高:1千"
        //     this.find("txtMinBetNum").string = "最低:1"
        //     this.nodeChip1.active = true
        // }
        // else if (2 == gUserData.roomInfo.room_setup_info.bet_limit_type) {
        //     this.find("txtMaxBetNum").string = "最高:1万"
        //     this.find("txtMinBetNum").string = "最低:10"
        //     this.nodeChip2.active = true
        // }
        this.find("txtMaxBetNum").string = "最高:" + gUserData.roomInfo.room_setup_info.hig_bet;
        this.find("txtMinBetNum").string = "最低:" + gUserData.roomInfo.room_setup_info.low_bet;
        this.nodeChip1.active = true;
        this.setLeftCardNum(gUserData.roomInfo.surplus_cards);

        //设置筹码状态
        var betInfoList = gUserData.roomInfo.user_betting_info_list;
        for (var i = 0; i < betInfoList.length; i++) {
            var info = betInfoList[i];
            var player = this.getPlayerByUid(info.uid);
            player.setBetInfo(clone(info));
        }

        var view = this.openView("prefabs/wayBill/WayBillView");
        view.setData(gUserData.roomInfo.chess_cards_way_list);
        view.hide();

        this.mgr.handleRoomInfo();
    },

    dissolve: function dissolve() {
        if ("wait" == gUserData.roomInfo.room_status) {
            if (this.mgr.isRoomOwner()) {
                cc.common.showMsgBox({
                    type: 2, msg: "是否解散房间，开局前解散房间不扣除钻石", okCb: function () {
                        this.mgr.reqRoomClose();
                    }.bind(this),
                    cancleCb: function () {}.bind(this)
                });
            } else {
                this.mgr.reqRoomLeave();
            }
        }
    },

    btnGameStart: function btnGameStart() {
        this.mgr.reqStartGame();
    },

    //显示 切牌后的丢牌
    showDiscard: function showDiscard(flipCard) {
        // var self = this
        this.find("pokerDiscard").active = true;
        cc.resMgr.updateSprite(this.find("discardFront"), cc.resMgr.getCardResResultName({ type: flipCard.type, num: flipCard.cards, index: 1 }), true);
        var num = flipCard.cards;
        if (num > 10) {
            num = 10;
        }
        cc.resMgr.updateSprite(this.find("discardBg"), "discardBg/poker_back_" + num, true);
        this.setLeftCardNum(this.leftCardNum - (num + 1));

        scheduleTimeOut(function () {
            this.find("pokerDiscard").active = false;
        }.bind(this), this, 2);
    },

    getSelectChip: function getSelectChip() {
        var nodeChipTarget;
        if (this.nodeChip1.active) {
            nodeChipTarget = this.nodeChip1;
        } else {
            nodeChipTarget = this.nodeChip2;
        }
        for (var i = 1; i <= 5; i++) {
            var chip = nodeChipTarget.getChildByName("chip" + i);
            if (chip.getComponent(cc.Toggle).isChecked) {
                return chip;
            }
        }
    },

    //获取场景的玩家
    getPlayerByUid: function getPlayerByUid(uid) {
        for (var i = 0; i <= 9; i++) {
            // var player = this.find("player" + i)
            var player = this["player" + i];
            if (player.data && player.getUid() == uid) {
                return player;
            }
        }
    },

    compareCards: function compareCards(ret) {
        var checkZXdui = function () {
            //庄对
            if (-1 != ret.state_info.state_list.indexOf(4)) {
                this.find("aniZhuangdui").active = true;
                this.find("aniZhuangdui").getComponent(cc.Animation).play();
                cc.musicMgr.playEffect("zhuangduixiandui.mp3");
            }
            //闲对
            if (-1 != ret.state_info.state_list.indexOf(5)) {
                this.find("aniXiandui").active = true;
                this.find("aniXiandui").getComponent(cc.Animation).play();
                cc.musicMgr.playEffect("zhuangduixiandui.mp3");
            }
        }.bind(this);

        //中途结算的比牌
        if (0 == ret.is_last_compare_cards) {
            checkZXdui();
            this.midCompareFinish = true;
        } else {
            //如果已经中途结算过，那么庄对闲对特效已经播放过
            if (!this.midCompareFinish) {
                checkZXdui();
            }
            this.midCompareFinish = false;
            //因比牌时间短牌未翻完，导致之前计算点数的方法有问题，重写新方法获取点数。
            //var xPoint = this.getCardTotalPoint(2)
            //var zPoint = this.getCardTotalPoint(1)
            var xPoint = this.newGetCardTotalPoint(2);
            var zPoint = this.newGetCardTotalPoint(1);

            if (-1 != ret.state_info.state_list.indexOf(7)) {
                cc.musicMgr.playEffect("x_tian_" + xPoint + ".mp3");
            } else {
                cc.musicMgr.playEffect("x" + xPoint + ".mp3");
            }

            if (ret.state_info.state_list && ret.state_info.state_list.indexOf(1) != -1) {
                this.node_quanxian_zhuang.getComponent("PowerObj").flip();
            }
            if (ret.state_info.state_list && ret.state_info.state_list.indexOf(2) != -1) {
                this.node_quanxian_xian.getComponent("PowerObj").flip();
            }

            scheduleTimeOut(function () {
                if (-1 != ret.state_info.state_list.indexOf(6)) {
                    cc.musicMgr.playEffect("z_tian_" + zPoint + ".mp3");
                } else {
                    cc.musicMgr.playEffect("z" + zPoint + ".mp3");
                }
            }.bind(this), this, 2);

            scheduleTimeOut(function () {
                this.zhuangTianEffectPlay = false;
                this.xianTianEffectPlay = false;
                //庄方天牌
                if (-1 != ret.state_info.state_list.indexOf(6)) {
                    this.zhuangTianEffectPlay = true;
                    this.cardList[3].js.showTianPaiEffect();
                    this.cardList[4].js.showTianPaiEffect();
                    this.cardList[6].js.showTianPaiEffect();
                    cc.musicMgr.playEffect("tianpai.mp3");
                }
                //闲方天牌
                if (-1 != ret.state_info.state_list.indexOf(7)) {
                    this.xianTianEffectPlay = true;
                    this.cardList[1].js.showTianPaiEffect();
                    this.cardList[2].js.showTianPaiEffect();
                    this.cardList[5].js.showTianPaiEffect();
                    cc.musicMgr.playEffect("tianpai.mp3");
                }
                //庄赢
                if (-1 != ret.state_info.state_list.indexOf(1)) {
                    cc.director.getScheduler().schedule(function () {
                        this.cardList[3].js.compare();
                        this.cardList[4].js.compare();
                        this.cardList[6].js.compare();
                    }, this, 1, 0, 0, false);

                    // this.cardList[3].js.showYingPaiEffect()
                    // this.cardList[4].js.showYingPaiEffect()
                    // this.cardList[6].js.showYingPaiEffect()
                    cc.director.getScheduler().schedule(function () {
                        this.showZhuangYingPaiEffect();
                    }, this, 2, 0, 0, false);
                }
                //闲赢
                if (-1 != ret.state_info.state_list.indexOf(2)) {
                    cc.director.getScheduler().schedule(function () {
                        this.cardList[1].js.compare();
                        this.cardList[2].js.compare();
                        this.cardList[5].js.compare();
                    }, this, 1, 0, 0, false);

                    // this.cardList[1].js.showYingPaiEffect()
                    // this.cardList[2].js.showYingPaiEffect()
                    // this.cardList[5].js.showYingPaiEffect()
                    cc.director.getScheduler().schedule(function () {
                        this.showXianYingPaiEffect();
                    }, this, 2, 0, 0, false);
                }
                this.playChipAreaFlash(ret.state_info.state_list);
            }.bind(this), this, 1);
        }
    },

    showZhuangYingPaiEffect: function showZhuangYingPaiEffect() {
        this.yingPaiEffect.active = true;
        // var moveTo = cc.moveTo(0.5, this._zhuangCompareCardPos)
        // var scaleTo = cc.scaleTo(0.5, 1.2)
        // var spawn = cc.spawn(moveTo, scaleTo)
        // this.find("zhuangYingPaiEffect").runAction(spawn)

        // if (this.zhuangTianEffectPlay) {
        //     cc.director.getScheduler().schedule(function () {
        //         cc.log("schedule赢牌特效")
        this.zhuangThanCardEffect.getComponent(cc.Animation).play();
        this.zhuangCardParticle.resetSystem();
        //    }, this, this.cardList[3].js.getTianPaiEffectPlayTime(), 0, 0, false);
        //}
        //else {
        //    cc.log("赢牌特效")
        //     this.zhuangThanCardEffect.getComponent(cc.Animation).play()
        //     this.zhuangCardParticle.resetSystem()
        // }
    },

    showXianYingPaiEffect: function showXianYingPaiEffect() {
        this.yingPaiEffect.active = true;
        // var moveTo = cc.moveTo(0.5, this._xianCompareCardPos)
        // var scaleTo = cc.scaleTo(0.5, 1.2)
        // var spawn = cc.spawn(moveTo, scaleTo)
        // this.find("xianYingPaiEffect").runAction(spawn)

        // if (this.xianTianEffectPlay) {
        //     cc.director.getScheduler().schedule(function () {
        //         cc.log("schedule赢牌特效")
        this.xianThanCardEffect.getComponent(cc.Animation).play();
        this.xianCardParticle.resetSystem();
        //     }, this, this.cardList[1].js.getTianPaiEffectPlayTime(), 0, 0, false);
        // }
        // else {
        //     cc.log("赢牌特效")
        //     this.xianThanCardEffect.getComponent(cc.Animation).play()
        //     this.xianCardParticle.resetSystem()
        // }
    },

    testBet: function testBet() {
        //test 下注测试
        this.find("nodeBtnOwner").active = false;
        this.find("nodeBtnPlayer").active = false;
        // var self = this
        var addChip = function (ret) {
            var player = this.getPlayerByUid(gUserData.uid);
            var nodeName = clientBetState[ret.state];
            if (1 == ret.state || 2 == ret.state) {
                var seatId = player.getClientSeatId();
                nodeName = nodeName + seatId;
            }
            var value = player.getTotalChipValueArea(ret.state);
            player.setChipsOnArea(value + ret.jetton, ret.state);
        }.bind(this);
        for (var i = 1; i <= 5; i++) {
            addChip({ state: i, jetton: 5 });
        }

        scheduleTimeOut(function () {
            var player = this.getPlayerByUid(gUserData.uid);
            player.chipSettle({ state_list: [1] });
        }.bind(this), this, 1.5);
    },

    showWayBill: function showWayBill() {
        var view = this.openView("prefabs/wayBill/WayBillView");
        // view.test()
    },

    //获取玩家下注筹码的父节点
    getPlayerBetParent: function getPlayerBetParent(seatId, area) {
        var nodeName = clientBetState[area];
        if (1 == area || 2 == area) {
            nodeName = nodeName + seatId;
        }
        var node;
        // var obj = this.find(nodeName)
        var obj = this[nodeName];
        if (cc.js.getClassName(obj) == "cc.Node") {
            node = obj;
        } else {
            node = obj.node;
        }
        if (1 == area || 2 == area) {
            return node.getChildByName("layout");
        } else {
            // if (this.find("player" + seatId).getUid() == gUserData.uid) {
            if (this["player" + seatId].getUid() == gUserData.uid) {
                return node.getChildByName("layout_my");
            } else {
                return node.getChildByName("layout_other");
            }
        }
    },

    //设置庄家挤牌权
    setBankerDelegate: function setBankerDelegate(uid) {
        this.node_quanxian_zhuang.stopAllActions();
        var zhuangPlayer = this.getPlayerByUid(uid);
        if (zhuangPlayer) {
            var dis = cc.pDistance(this.node_quanxian_zhuang.position, zhuangPlayer.node.position);
            var time = Math.ceil(dis / 100) * 0.05;
            this.node_quanxian_zhuang.runAction(cc.moveTo(time, zhuangPlayer.node.position));
        } else {
            // this.node_quanxian_zhuang.position = this.find("posZhuangPowerObj").position
            this.node_quanxian_zhuang.position = this.pos_quanxian_zhuang;
        }
    },

    setXianDelegate: function setXianDelegate(uid) {
        this.node_quanxian_xian.stopAllActions();
        var xianPlayer = this.getPlayerByUid(uid);
        if (xianPlayer) {
            var dis = cc.pDistance(this.node_quanxian_xian.position, xianPlayer.node.position);
            var time = Math.ceil(dis / 100) * 0.05;
            this.node_quanxian_xian.runAction(cc.moveTo(time, xianPlayer.node.position));
        } else {
            // this.node_quanxian_xian.position = this.find("posXianPowerObj").position
            this.node_quanxian_xian.position = this.pos_quanxian_xian;
        }
    },

    showSettingView: function showSettingView() {
        var view = this.openView("prefabs/settingView/SettingView");
        //游戏还没开始，设置界面的解散按钮隐藏
        if ("wait" == gUserData.roomInfo.room_status) {
            view.find("btn_jrfj").active = false;
        } else {
            view.find("btn_jrfj").active = true;
        }
        // this.playChipAreaFlash()
    },

    showChatView: function showChatView() {
        var view = this.openView("prefabs/chat/ChatView");
    },

    buCardsTest: function buCardsTest() {
        // var self = this
        var ret = {};
        ret.player_mend_cards = [];
        ret.banker_mend_cards = [];
        // ret.player_mend_cards.push({cards : 13, type : 3})
        // ret.banker_mend_cards.push({cards : 13, type : 3})
        ret.player_mend_cards = { cards: 13, type: 3 };
        ret.banker_mend_cards = { cards: 13, type: 3 };
        this.buCards(ret);

        scheduleTimeOut(function () {
            this.handleSqueeze({ state: 2 });
        }.bind(this), this, 2.5);
    },

    //更新筹码下注总数(仅房主显示)
    updateTotalBetInfo: function updateTotalBetInfo() {
        if (!this.mgr.isRoomOwner()) {
            return;
        }
        var txtList = [];
        txtList[1] = this.txtZhuangTotalBetNum;
        txtList[2] = this.txtXianTotalBetNum;
        txtList[3] = this.txtHeTotalBetNum;
        txtList[4] = this.txtZhuangduiTotalBetNum;
        txtList[5] = this.txtXianduiTotalBetNum;
        for (var i = 1; i <= 5; i++) {
            var num = this.mgr.totalBetNumList[i];
            txtList[i].string = num;
        }
    },

    onBtnWindow: function onBtnWindow() {
        // var view = cc.sceneNode.js.openView("prefabs/battleRecord/SingleBattleRecordView")
        // view.owner_uid = gUserData.roomInfo.owner_base_info.uid
        // view.reqGameRecord("1000056")

        // this.isTest = !this.isTest
        // if (this.isTest) {
        //     cc.netMgr.onAppBack()
        // }
        // else {
        //     cc.netMgr.onAppFront()
        // }

        GameToAppHelper.backToApp();
    },

    onBtnClearBet: function onBtnClearBet() {
        this.mgr.reqClearBet();
    },

    onBtnConfirmBet: function onBtnConfirmBet() {
        this.mgr.reqStopBet();
        this.find("nodeChip").active = false;
        this.find("player1").hideTimer();
    },

    setLeftCardNum: function setLeftCardNum(num) {
        this.leftCardNum = num;
        this.find("txtLeftCardsNum").string = "剩牌数:" + num;
    },

    onDestroy: function onDestroy() {
        this._super();
        cc.log("onDestroy", cc.eventManager);
        cc.eventManager.removeListener(this.eventHideListener);
        cc.eventManager.removeListener(this.eventShowListener);
        //1.6版本有BUG，无法清除正在跑的计时器（naive平台），但是这行代码还是要保留
        cc.director.getScheduler().unscheduleAllForTarget(this);
    },

    getNeedSqueezeCard: function getNeedSqueezeCard() {
        var list = [];
        for (var i = 1; i <= 6; i++) {
            var card = this.cardList[i];
            if (card.js.isNeedJi()) {
                list.push(card);
            }
        }
        return list;
    },

    //翻牌按钮回调
    onBtnFlipCard: function onBtnFlipCard() {
        var list = this.getNeedSqueezeCard();
        for (var i = 0; i < list.length; i++) {
            var card = list[i];
            card.js.requestSqueeze();
        }
    },

    //下注区域闪光的动画
    playChipAreaFlash: function playChipAreaFlash(state_list) {
        if (-1 != state_list.indexOf(1)) {
            this.light_zhuang.active = true;
            this.light_zhuang.opacity = 255;
            this.light_zhuang.getComponent(cc.Animation).play();
        } else if (-1 != state_list.indexOf(2)) {
            this.light_xian.active = true;
            this.light_xian.opacity = 255;
            this.light_xian.getComponent(cc.Animation).play();
        } else if (-1 != state_list.indexOf(3)) {
            this.light_he.active = true;
            this.light_he.opacity = 255;
            this.light_he.getComponent(cc.Animation).play();
        }
    },

    //获取可以转移挤牌权的玩家列表(type1庄 2闲)
    getCanMovePowerObjPlayers: function getCanMovePowerObjPlayers(type) {
        var list = [];
        for (var i = 2; i <= 9; i++) {
            // var player = this.find("player" + i)
            var player = this["player" + i];
            if (player.data && player.getTotalChipValueArea(type) != 0) {
                list.push(player);
            }
        }
        return list;
    },

    onInviteFriends: function onInviteFriends() {
        cc.log("微信邀请好友！");
        GameToAppHelper.weChatRoomInvite();
    },

    onInviteDDFriends: function onInviteDDFriends() {
        cc.log("丁丁邀请好友！");
        GameToAppHelper.dingdingRoomInvite();
    },

    //处理审核
    handleExamine: function handleExamine() {
        if (!IS_EXAMINE) {
            return;
        }
        this.find("btnDingding").active = false;
        this.find("btnWechat").active = false;
        this.find("btnDingding1").active = false;
        this.find("btnWechat2").active = false;
        this.find("btnLog").active = false;
    }

});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=GameScene.js.map
        