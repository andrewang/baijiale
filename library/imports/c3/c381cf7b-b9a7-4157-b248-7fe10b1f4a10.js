"use strict";
cc._RF.push(module, 'c381c97uadBV7JIf+ELH0oQ', 'Card');
// scripts/common/card/Card.js

"use strict";

var BaseObj = require("BaseObj");
var serverIndex = {};
serverIndex[1] = 1;
serverIndex[2] = 2;
serverIndex[3] = 1;
serverIndex[4] = 2;
serverIndex[5] = 3;
serverIndex[6] = 3;

var roleIndex = {};
roleIndex[1] = 2;
roleIndex[2] = 2;
roleIndex[3] = 1;
roleIndex[4] = 1;
roleIndex[5] = 2;
roleIndex[6] = 1;

var cardState = {
    begin: 0,
    dealMove: 1, //发牌移动
    moveToJi: 2, //移动到挤牌的地方
    isJi: 3, //正在挤牌
    backToNormal: 4, //挤牌完移动到正常位置
    end: 5,
    onFlipAct: 6 //在翻转的动作中
};

var zorder = {
    init: 10,
    onDeal: 40, //发牌的时候
    normal: 30, //一般情况
    onCompare: 60, //比牌
    onJi: 100 //挤牌
};

var getScaleParam = function getScaleParam(scaleNum) {
    if (cc.gameMgr.curJipaiPlayerUid == cc.gameMgr._myData.user_base_info.uid) {
        var scale1 = 3.0;
        var scale2 = 1;
        var scale3 = 0.35;
        if (1 == scaleNum) {
            return scale1;
        } else if (2 == scaleNum) {
            return scale2;
        } else if (3 == scaleNum) {
            return scale3;
        }
    } else {
        var scale1 = 1;
        var scale2 = 0.35;
        var scale3 = 0.35;
        if (1 == scaleNum) {
            return scale1;
        } else if (2 == scaleNum) {
            return scale2;
        } else if (3 == scaleNum) {
            return scale3;
        }
    }
};

cc.Class({
    extends: BaseObj,

    properties: {
        //1~13
        // num: 0,
        // //黑桃1，红桃2，梅花3，方块4
        // type: 0,
        // //客户端牌的索引 闲家125 庄家346
        // index: 0,
        //判断是否能发挤牌位置同步的协议
        isCanSend: true,
        //是否能发请求挤牌，因为挤牌的过程中触摸判断会导致发送多次，这里控制只发一次
        isCanSendJiPaiRequest: true
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();

        // this.threeDNode = this.find("threeDNode")
        // this.reset()
        this.initListener();

        for (var i = 1; i <= 6; i++) {
            this["tianpai" + i] = this.find("tianpai" + i);

            this["YingPai" + i] = this.find("YingPai" + i);
        }
        this.cardNode = this.find("cardNode");
        this.firstSqueezeNode = this.find("firstSqueezeNode");
    },

    initListener: function initListener() {
        var offset;
        var touchNode = this.find("cardMove").node;
        var oldPos = clone(touchNode.position);
        var size = touchNode._contentSize;
        touchNode.on(cc.Node.EventType.TOUCH_START, function (touch) {
            this.showFirstSquezze(false);
            var beginPos = touchNode.parent.convertTouchToNodeSpaceAR(touch);
            offset = { x: beginPos.x - touchNode.position.x, y: beginPos.y - touchNode.position.y };
        }, this);
        touchNode.on(cc.Node.EventType.TOUCH_MOVE, function (touch) {
            if (cc.gameMgr.curJipaiPlayerUid != cc.gameMgr._myData.user_base_info.uid) {
                return;
            }

            var pos = touchNode.parent.convertTouchToNodeSpaceAR(touch);
            touchNode.position = { x: pos.x - offset.x, y: pos.y - offset.y };

            if (this.isCanSend) {
                this.isCanSend = false;
                var pos = { x: touchNode.position.x, y: touchNode.position.y, index: this.data.index };
                cc.netMgr.request("room_game_squeeze_cards_pos", { pos: pos }, function (ret) {
                    cc.netMgr.exec(ret, function () {});
                });
                //设置发送协议的时间间隔
                setTimeout(function () {
                    this.isCanSend = true;
                }.bind(this), 10);
            }

            if (true == this.isCanSendJiPaiRequest && (Math.abs(touchNode.position.x - oldPos.x) >= size.width / 2 || Math.abs(touchNode.position.y - oldPos.y) >= size.height / 2)) {
                this.isCanSendJiPaiRequest = false;
                // cc.netMgr.request("room_game_squeeze_cards", { index: serverIndex[this.data.index], state: roleIndex[this.data.index] }, function (ret) {
                //     cc.netMgr.exec(ret, function () {
                //     })
                // })
                this.requestSqueeze();
                // this.squeezeComplete()
            }
        }, this);

        this.find("cardBack").node.on(cc.Node.EventType.TOUCH_END, function (touch) {
            // cc.log("翻牌")
            // cc.netMgr.request("room_game_squeeze_cards", { index: serverIndex[this.data.index], state: roleIndex[this.data.index] }, function (ret) {
            //     cc.netMgr.exec(ret, function () {
            //     })
            // })
            this.requestSqueeze();
        }, this);
    },

    //发送挤牌协议
    requestSqueeze: function requestSqueeze() {
        cc.netMgr.request("room_game_squeeze_cards", { index: serverIndex[this.data.index], state: roleIndex[this.data.index] }, function (ret) {
            cc.netMgr.exec(ret, function () {});
        });
        // this.squeezeComplete()
    },

    reset: function reset() {
        this.data = { num: 0, type: 0, index: 0 };
        this.isCanSendJiPaiRequest = true;
        this.setSqueeze(false);
        this.find("cardMove").node.position = { x: 0, y: 0 };
        this.showNum(false);
        this.state = cardState.begin;

        for (var i = 1; i <= 6; i++) {
            this["tianpai" + i].getComponent(cc.Animation).stop();
            this["tianpai" + i].active = false;

            this["YingPai" + i].getComponent(cc.Animation).stop();
            this["YingPai" + i].active = false;
        }
        this.node.stopAllActions();
        this.node.setScale(1);
        this.node.setLocalZOrder(zorder.init);
    },

    setData: function setData(cardData, index) {
        var num = cardData.cards;
        var type = cardData.type;

        this.data = { num: num, type: type, index: index };
        cc.resMgr.updateSprite(this.find("cardFront"), cc.resMgr.getCardResName({ num: num, type: type, index: index }));
        cc.resMgr.updateSprite(this.find("cardBack"), cc.resMgr.getCardBackName({ index: index }));
        cc.resMgr.updateSprite(this.find("cardMove"), cc.resMgr.getCardBackName({ index: index }));
        cc.resMgr.updateSprite(this.find("cardNumUp"), cc.resMgr.getNumRes({ num: this.data.num, type: this.data.type, index: this.data.index }));
        cc.resMgr.updateSprite(this.find("cardNumDown"), cc.resMgr.getNumRes({ num: this.data.num, type: this.data.type, index: this.data.index }));
    },

    showTianPaiEffect: function showTianPaiEffect() {
        var node = this["tianpai" + this.data.index];
        if (node) {
            //cc.log("天牌特效" + node.name)
            this.tianpaiStage = node.getComponent(cc.Animation).play();
            node.active = true;
        }
    },

    getTianPaiEffectPlayTime: function getTianPaiEffectPlayTime() {
        if (this.tianpaiStage) {
            var time = this.tianpaiStage.duration;
            this.tianpaiStage = null;
            cc.log("天牌特效时间：" + time);
            return time;
        }
        return 0;
    },

    showYingPaiEffect: function showYingPaiEffect() {
        // var node = this["YingPai" + this.data.index]
        // if (node) {
        //     if (this.tianpaiStage)
        //     {
        //         cc.log("天牌特效时间：" + this.tianpaiStage.duration)
        //         cc.director.getScheduler().schedule(function () {
        //             cc.log("tianpaiStage赢牌特效" + node.name)
        //             node.getComponent(cc.Animation).play()
        //             node.active = true
        //             this.tianpaiStage = null
        //         }, this, this.tianpaiStage.duration, 0, 0, false);
        //         return
        //     }
        //     cc.log("赢牌特效" + node.name)
        //     node.getComponent(cc.Animation).play()
        //     node.active = true
        // }
    },

    showBack: function showBack() {
        this.find("cardBack").node.active = true;
        this.find("cardFront").node.active = false;
    },

    showFront: function showFront() {
        this.find("cardBack").node.active = false;
        this.find("cardFront").node.active = true;
    },

    flip: function flip() {
        if (this.state == cardState.end) {
            return;
        } else if (this.state == cardState.isJi) {
            this.squeezeComplete();
        } else {
            this.state = cardState.onFlipAct;
            var cb1 = cc.callFunc(function () {
                this.showFront();
            }.bind(this));
            var cb2 = cc.callFunc(function () {
                // cc.musicMgr.playEffect("flip_card.mp3")
                // cc.gameMgr.view.showScore()
                this.squeezeComplete();
            }.bind(this));
            var act1 = cc.sequence(cc.scaleTo(0.2, 0, 1), cb1);
            var act2 = cc.sequence(cc.scaleTo(0.2, 1, 1), cb2);
            var seq = cc.sequence(act1, act2);
            this.node.runAction(seq);
        }
    },

    isOnFlip: function isOnFlip() {
        return this.state == cardState.onFlipAct || this.state == cardState.backToNormal;
    },

    isNeedJi: function isNeedJi() {
        return this.state == cardState.isJi;
    },

    showNum: function showNum(isShow) {
        if (isShow) {
            this.find("cardNumUp").node.active = true;
            this.find("cardNumDown").node.active = true;
        } else {
            this.find("cardNumUp").node.active = false;
            this.find("cardNumDown").node.active = false;
        }
    },

    //判断牌是否正面朝上状态
    isFront: function isFront() {
        return this.find("cardFront").node.active && !this.isSquezze();
    },

    dealMove: function dealMove(pos, callback) {
        //为了避免协议堵塞导致动画播放顺序乱的问题
        if (this.state > cardState.dealMove) {
            return;
        }
        this.state = cardState.dealMove;
        this.node.stopAllActions();
        this.node.setScale(1);
        this.showNum(false);
        this.node.setLocalZOrder(zorder.onDeal);
        var time = 0.5;
        var moveTo = cc.moveTo(time, pos);
        var cb = cc.callFunc(function () {
            if (callback) {
                callback();
            }
            this.node.setLocalZOrder(zorder.normal + this.data.index);
        }.bind(this));
        var spawn = cc.spawn(moveTo, cc.rotateTo(time, 0));
        var seq = cc.sequence(spawn, cb);
        this.node.runAction(seq);
    },

    move: function move(pos) {
        this.node.stopAllActions();
        this.node.setScale(1);
        var time = 0.5;
        var moveTo = cc.moveTo(time, pos);
        this.node.runAction(moveTo);
    },

    //移动到挤牌的那个位置
    moveToSqueeze: function moveToSqueeze(pos) {
        if (this.state > cardState.dealMove) {
            return;
        }
        this.state = cardState.moveToJi;
        this.node.setLocalZOrder(zorder.onJi); //改变挤牌时的层级关系
        var cbFunc = function () {
            this.state = cardState.isJi;
            this.showFront();
            this.setSqueeze(true);
            // this.node.setScale(1)
            this.node.setScale(getScaleParam(2));
            this.node.setRotation(0);
            var data = this.data;
            cc.resMgr.updateSprite(this.find("cardFront"), cc.resMgr.getJiPaiResName({ type: data.type, num: data.num, index: data.index, isBack: false }));
            cc.resMgr.updateSprite(this.find("cardMove"), cc.resMgr.getJiPaiResName({ type: data.type, num: data.num, index: data.index, isBack: true }));
            if (cc.gameMgr.getSqueezeType() == squeezeType.threeD) {
                // this.find("cardNode").active = false
                var scale;
                if (cc.gameMgr.curJipaiPlayerUid == cc.gameMgr._myData.user_base_info.uid) {
                    var isWrite = cc.sys.localStorage.getItem("firstSqueeze") ? true : false;
                    cc.log("firstSqueeze: isWrite", isWrite);
                    this.showFirstSquezze(!isWrite);
                    scale = 1;
                } else {
                    scale = 0.35;
                }
                this.cardNode.active = false;
                this.threeDNode = new cc.Node("threeDNode");
                this.threeDNode.parent = this.node.parent;
                this.threeDNode.position = this.node.position;
                this.threeDCardJs = this.threeDNode.addComponent("ThreeDCard");
                this.threeDCardJs.init({
                    front: cc.resMgr.getJiPaiResName({ type: data.type, num: data.num, index: data.index, isBack: false }),
                    back: cc.resMgr.getJiPaiResName({ index: data.index, isBack: true }), cardJs: this, scale: scale
                });
                this.threeDNode.setContentSize(this.threeDCardJs.getSize());
            }
        }.bind(this);

        if (pos.x == this.node.position.x && pos.y == this.node.position.y) {
            cbFunc();
        } else {
            this.node.stopAllActions();
            this.node.setScale(1);
            var moveTo = cc.moveTo(0.5, pos);
            // var actionTo = cc.scaleTo(0.5, scale1)
            var actionTo = cc.scaleTo(0.5, getScaleParam(1));
            var spawn = cc.spawn(moveTo, actionTo);
            var cb = cc.callFunc(cbFunc);
            var seq = cc.sequence(spawn, cb);
            this.node.runAction(seq);
        }
    },

    //挤牌完成
    squeezeComplete: function squeezeComplete(bBuPai) {
        this.showFirstSquezze(false);
        if (!cc.sys.localStorage.getItem("firstSqueeze") && this.state == cardState.isJi) {
            cc.log("setFirstSqueeze" + "   stage" + this.state);
            cc.sys.localStorage.setItem("firstSqueeze", 1);
        }
        this.state = cardState.backToNormal;
        this.setSqueeze(false);
        if (cc.gameMgr.getSqueezeType() == squeezeType.threeD) {
            // this.find("cardNode").active = true
            this.cardNode.active = true;
            if (this.threeDCardJs) {
                this.node.rotation = this.threeDCardJs.rotateAngle;
                this.threeDCardJs.releaseGL();
                this.threeDCardJs.destroy();
            }
        }
        // this.find("cardNode").active = true
        this.cardNode.active = true;
        this.showNum(true);
        this.showFront(true);
        cc.gameMgr.view.showScore();
        cc.musicMgr.playEffect("flip_card.mp3");
        //回去对应的位置

        var cbFunc = function () {
            this.state = cardState.end;
            this.node.setScale(1);
            this.node.setRotation(0);
            cc.resMgr.updateSprite(this.find("cardFront"), cc.resMgr.getCardResName({ num: this.data.num, type: this.data.type, index: this.data.index }));
            this.showNum(false);
            // this.node.setLocalZOrder(zorder.normal)
            this.node.setLocalZOrder(zorder.normal + this.data.index);
            cc.gameMgr.checkFlip();
            cc.gameMgr.checkDelaySqueeze();
        }.bind(this);
        var pos = cc.gameMgr.view.find("posCard" + this.data.index).node.position;
        if (bBuPai) {
            pos = cc.gameMgr.view.find("dieposCard" + this.data.index).node.position;
        }
        if (pos.x == Math.round(this.node.position.x) && pos.y == Math.round(this.node.position.y)) {
            cbFunc();
        } else {
            this.node.stopAllActions();
            // this.node.setScale(1)
            this.node.setScale(getScaleParam(2));
            var moveTo = cc.moveTo(0.5, pos);
            // var actionTo = cc.scaleTo(0.5, scale2)
            var actionTo = cc.scaleTo(0.5, getScaleParam(3));
            var spawn = cc.spawn(moveTo, actionTo);
            var cb = cc.callFunc(cbFunc);
            var seq = cc.sequence(cc.delayTime(0.5), spawn, cb);
            this.node.runAction(seq);
        }
    },

    //比牌动作
    compare: function compare() {
        if (this.data.index) {
            this.node.stopAllActions();
            this.node.setScale(1);
            this.node.setLocalZOrder(zorder.onCompare + this.data.index);
            var pos = cc.gameMgr.view.find("compareCard" + this.data.index).node.position;
            //策划的需求，如果有补牌，则需要把第二张牌叠在第一章牌上
            if (2 == this.data.index && true == cc.gameMgr.view.cardList[5].active || 4 == this.data.index && true == cc.gameMgr.view.cardList[6].active) {
                pos = cc.gameMgr.view.find("diecompareCard" + this.data.index).node.position;
            }
            var moveTo = cc.moveTo(0.5, pos);
            var scaleTo = cc.scaleTo(0.5, 1.2);
            var spawn = cc.spawn(moveTo, scaleTo);
            this.node.runAction(spawn);
        }
    },

    //是否挤牌
    setSqueeze: function setSqueeze(bool) {
        this.find("cardMove").node.active = bool;
    },

    isSquezze: function isSquezze() {
        return this.find("cardMove").node.active;
    },

    getIndex: function getIndex() {
        return this.data.index;
    },

    getCardNum: function getCardNum() {
        return this.data.num;
    },

    getCardType: function getCardType() {
        return this.data.type;
    },

    //扑克是属于庄还是属于闲 1庄 2闲
    getCardOwner: function getCardOwner() {
        var zhuangList = [3, 4, 6];
        var xianList = [1, 2, 5];
        if (zhuangList.indexOf(this.getIndex()) != -1) {
            return 1;
        } else {
            return 2;
        }
    },

    showFirstSquezze: function showFirstSquezze(isFirst) {
        if (this.firstSqueezeNode.active != isFirst) {
            this.firstSqueezeNode.active = isFirst;
        }
    }
});

cc._RF.pop();