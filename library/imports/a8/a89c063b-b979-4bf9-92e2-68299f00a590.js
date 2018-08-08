"use strict";
cc._RF.push(module, 'a89c0Y7uXlL+ZLiaCmfAKWQ', 'Player');
// scripts/app/game/player/Player.js

"use strict";

var BaseObj = require("BaseObj");
var stateEnmu = require("GameConfig").stateEnmu;
var record = require("RecordMgr");
cc.Class({
    extends: BaseObj,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        this._super();

        this.pb_timer = this.find("pb_timer");
        this.optional = this.find("optional");
        this.txtName = this.find("txtName");
        this.imgIcon = this.find("imgIcon");
        this.picture_frame = this.find("picture_frame");
        this.txtGold = this.find("txtGold");
        this.pb = this.pb_timer.getComponent(cc.ProgressBar);
        this.hideTimer();
        this.betTotalValue = 0; //这盘下注的总额
        //空座位邀请好友
        this.find("nodeNoPlayer").node.on(cc.Node.EventType.TOUCH_END, function (touch) {
            if (IS_EXAMINE) {
                return;
            }
            //允许中途加入才需要邀请  或者  游戏未开始
            if (1 == gUserData.roomInfo.room_setup_info.midway_join || "wait" == gUserData.roomInfo.room_status) {
                var view = cc.gameMgr.view.openView("prefabs/share/InvitationView");
            }
        }, this);
        this.imgIcon.on(cc.Node.EventType.TOUCH_END, function (touch) {
            var view = cc.gameMgr.view.openView("prefabs/player/PlayerInfoView");
            view.setData(clone(this.data));
        }.bind(this), this);
        this.find("aniWin").getComponent(cc.Animation).on('stop', function () {
            this.find("aniWin").active = false;
            this.find("avatarAnimation").active = false;
        }, this);
    },

    init: function init(clientSeatId) {
        this.find("nodeNoPlayer").node.active = true;
        this.find("nodePlayer").active = false;
        this.find("optional").active = false;
        // this.find("imgBubble").active = false
        this.imgBubble = cc.gameMgr.view.find(this.node._name + "_imgBubble");
        this.imgBubble.active = false;
        this.clientSeatId = clientSeatId;
        this.data = null;
        this.find("txtGold").string = 0;
        this.find("aniWin").active = false;
        this.find("avatarAnimation").active = false;
        this.reset();
    },

    reset: function reset() {
        // this.showZhuangTag(false)
        // this.showXianTag(false)
        //该玩家下注的所有筹码
        this.chipList = {};
        for (var i = 1; i <= 5; i++) {
            this.chipList[i] = [];
        }
        this.betTotalValue = 0;
        cc.musicMgr.stop(this.timerAudioId);
        this.timerAudioId = null;
    },

    //获取玩家下注的筹码总量
    getTotalChipValue: function getTotalChipValue() {
        var totalValue = 0;
        for (var i = 1; i <= 5; i++) {
            for (var j = 0; j < this.chipList[i].length; j++) {
                var chip = this.chipList[i][j];
                var value = chip.getComponent("ChipSmall").getValue();
                totalValue += value;
            }
        }
        return totalValue;
    },

    getTotalChipValueArea: function getTotalChipValueArea(area) {
        var totalValue = 0;
        for (var j = 0; j < this.chipList[area].length; j++) {
            var chip = this.chipList[area][j];
            var value = chip.getComponent("ChipSmall").getValue();
            totalValue += value;
        }
        return totalValue;
    },

    //seatData {seat, user_base_info}
    setData: function setData(seatData) {
        this.find("nodeNoPlayer").node.active = false;
        this.find("nodePlayer").active = true;

        this.data = seatData;
        var nameString = /*seatData.user_base_info.uid + */seatData.user_base_info.name;
        if (this.getNameStringCount(nameString) > 10) //最多容纳5个汉字
            {
                nameString = nameString.substr(0, this.getNameStringCount(nameString, 8)) + ".."; //大于5个汉字,取前4个汉子字符加..表示
            }
        this.txtName.string = nameString;
        // this.find("txtGold").string = seatData.user_base_info.diamonds
        cc.resMgr.loadNetUrl(this.imgIcon.getComponent(cc.Sprite), seatData.user_base_info.avatar);

        //一号位玩家是房主还是玩家的显示区别
        if (1 == this.getClientSeatId()) {
            if (cc.gameMgr.isRoomOwner()) {
                this.txtName.node.color = cc.Color.WHITE.fromHEX("#C0DBFB");
                // this.txtName.node.color = cc.Color.YELLOW
                this.find("mask").setContentSize({ width: 96, height: 96 });
                this.imgIcon.setContentSize({ width: 96, height: 96 });
                this.pb_timer.bar.node.setContentSize({ width: 104, height: 104 });
                this.pb_timer.setContentSize({ width: 104, height: 104 });
                this.picture_frame.node.setContentSize({ width: 102, height: 102 });
            } else {
                this.txtName.node.color = cc.Color.WHITE.fromHEX("#00FFFF");
                // this.txtName.node.color = cc.Color.BLUE
                this.find("mask").setContentSize({ width: 108, height: 108 });
                this.imgIcon.setContentSize({ width: 108, height: 108 });
                this.pb_timer.bar.node.setContentSize({ width: 116, height: 116 });
                this.pb_timer.setContentSize({ width: 112, height: 112 });
                this.picture_frame.node.setContentSize({ width: 114, height: 114 });
            }
        }
        //自身是房主，名字也要变色
        if (0 == this.getClientSeatId() && cc.gameMgr.isRoomOwner()) {
            this.txtName.node.color = cc.Color.WHITE.fromHEX("#00FFFF");
        }
    },

    setGoldNum: function setGoldNum(num) {
        //取整
        //num = '-1088.00'
        num = Math.floor(num);
        if (num == 0) //很无奈，不知道为什么在模拟器上会显示成0.00，故做特殊处理
            {
                this.txtGold.string = 0;
            } else if (num > 0) {
            this.txtGold.string = parseFloat(num); //去除小数点后面多余的0
        } else {
            num = Math.abs(num); //取绝对值
            this.txtGold.string = "-" + parseFloat(num);
        }
    },

    //更新筹码数量
    updateGoldNum: function updateGoldNum(offset) {
        this.setGoldNum(Number(this.txtGold.string) + offset);
    },

    getUid: function getUid() {
        return this.data.user_base_info.uid;
    },

    getClientSeatId: function getClientSeatId() {
        return this.clientSeatId;
    },

    setChipsOnArea: function setChipsOnArea(totalValue, area) {
        var gameView = cc.gameMgr.view;
        var chipValueArr = [];
        var nodeChip = null;
        if (true == gameView.nodeChip1.active) {
            nodeChip = gameView.nodeChip1;
        } else {
            nodeChip = gameView.nodeChip2;
        }
        for (var i = 5; i >= 1; i--) {
            chipValueArr.push(Number(nodeChip["chip" + i].value.string));
        }

        //清除
        for (var i = 0; i < this.chipList[area].length; i++) {
            var chip = this.chipList[area][i];
            var value = chip.getComponent("ChipSmall").getValue();
            this.updateGoldNum(value);
            chip.getComponent("ChipSmall").node.destroy();
        }
        this.chipList[area] = [];

        for (var j = 0; j < chipValueArr.length; j++) {
            var value = chipValueArr[j];
            if (totalValue % value < totalValue) {
                var num = Math.floor(totalValue / value);
                for (var k = 1; k <= num; k++) {
                    var chip = this.addSmallChip(value, area);
                    var parent = gameView.getPlayerBetParent(this.getClientSeatId(), area);
                    chip.parent = parent;
                }
                totalValue = totalValue % value;
            }
        }
    },

    //增加一个筹码 value筹码的额 area下注的区域1庄 2闲 3和 4庄对 5闲对
    addSmallChip: function addSmallChip(value, area) {
        var chip = cc.instantiate(cc.res["prefabs/chip/ChipSmall"]);
        //这里要用getConponents，不能直接用.js,因为onload此时还没执行
        chip.getComponent("ChipSmall").setData({ value: value, area: area, seatData: this.data, clientSeatId: this.clientSeatId });
        this.chipList[area].push(chip);
        if (this.data) {
            this.updateChipTxtNum();
            this.updateGoldNum(-value);
        }
        //策划说筹码值越小的，放在最上面
        chip.setLocalZOrder(-value);
        this.betTotalValue = this.getTotalChipValue();
        return chip;
    },

    //清除所有筹码
    clearAllSmallChip: function clearAllSmallChip() {
        for (var i = 1; i <= 5; i++) {
            for (var j = 0; j < this.chipList[i].length; j++) {
                var chip = this.chipList[i][j];
                var value = chip.getComponent("ChipSmall").getValue();
                this.updateGoldNum(value);
                cc.gameMgr.totalBetNumList[i] -= value;
                chip.getComponent("ChipSmall").node.destroy();
            }
        }
        //更新房主筹码统计
        cc.gameMgr.view.updateTotalBetInfo();
        this.chipList = {};
        for (var i = 1; i <= 5; i++) {
            this.chipList[i] = [];
        }
        if (this.data) {
            this.updateChipTxtNum();
        }
    },

    //更新自己各筹码区域的筹码总额（这里的自己指客户端1号位的那个人）
    updateChipTxtNum: function updateChipTxtNum() {
        if (this.getUid() != gUserData.uid) {
            return;
        }
        var areaName = {};
        areaName[1] = "zhuang1";
        areaName[2] = "xian1";
        areaName[3] = "he";
        areaName[4] = "zhuangdui";
        areaName[5] = "xiandui";
        var gameView = cc.gameMgr.view;
        for (var i = 1; i <= 5; i++) {
            var nodeName = areaName[i];
            // var txtNum = gameView.find(nodeName).txtNum
            var txtNum = gameView[nodeName].txtNum;
            txtNum.node.active = this.chipList[i].length != 0;
            var totalValue = 0;
            for (var j = 0; j < this.chipList[i].length; j++) {
                var smChip = this.chipList[i][j];
                totalValue += smChip.getComponent("ChipSmall").getValue();
            }
            txtNum.string = totalValue;
        }
    },

    //筹码结算，移动到房主或者移动到自己
    //(1:庄，2:闲，3:和，4:庄对，5:闲对，6:庄方天牌，7:闲方天牌) isMiddle是否中途结算
    chipSettle: function chipSettle(state_info, isMiddle) {
        var self = this;
        if (0 == tableNums(state_info)) {
            return;
        }
        var gameView = cc.gameMgr.view;
        var self = this;
        function getPlayerPos(name, chip) {
            if (!gameView.find(name)) {
                cc.log("@@@@@error:", name);
            }
            var pos = gameView.find(name).node.position;
            var worldPos = gameView.node.convertToWorldSpaceAR(pos);
            // var layoutNode = chip.getComponent("ChipSmall").node.parent
            //下注区域图片的节点,这个节点跟玩家的节点都保持统一结构，这样转换位置才有意义
            // var areaNode = layoutNode.parent
            // var localPos = areaNode.convertToNodeSpaceAR(worldPos)
            var localPos = cc.gameMgr.view.find("nodeBetMove").convertToNodeSpaceAR(worldPos);
            return localPos;
        }
        //中途结算会结算庄对和闲对的
        var begin, end;
        if (isMiddle) {
            begin = 4;
            end = 5;
        } else {
            begin = 1;
            end = 3;
            // end = 5
        }

        function getChipLayout(area, isOther) {
            var areaList = {};
            // areaList[1] = "zhuang1"
            // areaList[2] = "xian1"
            areaList[1] = "zhuang" + self.getClientSeatId();
            areaList[2] = "xian" + self.getClientSeatId();
            areaList[3] = "he";
            areaList[4] = "zhuangdui";
            areaList[5] = "xiandui";
            var node = cc.gameMgr.view.find(areaList[area]);
            if (area >= 3) {
                if (isOther) {
                    return node.layout_other;
                } else {
                    return node.layout_my;
                }
            } else {
                return node.layout;
            }
        }

        function move(obj, beginPos, endPos, callback) {
            obj.stopAllActions();
            var dis = cc.pDistance(beginPos, endPos);
            var time = Math.ceil(dis / 100) * 0.1;
            var moveTo = cc.moveTo(time, endPos);
            var cb = cc.callFunc(function () {
                if (callback) {
                    callback();
                }
            });
            var seq = cc.sequence(moveTo, cb);
            obj.runAction(seq);
        }

        //拷贝筹码的layout代替旧的layout，旧的layout移动后销毁
        function cloneLayoutAndMove(i, pos, isOther) {
            var layout = getChipLayout(i, isOther);
            var worldPos = layout.node.parent.convertToWorldSpaceAR(layout.node.position);
            var localPos = cc.gameMgr.view.find("nodeBet").convertToNodeSpaceAR(worldPos);

            var name = layout.node._name;
            var newNode = new cc.Node(name);
            var newLayout = newNode.addComponent(cc.Layout);
            newLayout.type = layout.type;
            newLayout.resizeMode = layout.resizeMode;
            newLayout.spacingY = layout.spacingY;
            newLayout.verticalDirection = layout.verticalDirection;
            newLayout.node.scale = layout.node.scale;
            newNode.setContentSize(layout.node.getContentSize());
            newLayout.node._anchorPoint = layout.node._anchorPoint;
            newLayout.node.position = layout.node.position;
            var parent = layout.node.parent;
            layout.node.removeFromParent();
            parent.addChild(newNode);
            //因为调用了bindUiNode的缘故，新节点替换旧节点，所以这里要改变node的索引
            parent[name] = newLayout;
            // if (parent.layout) {
            //     parent.layout = newLayout
            // }
            // if (parent.layout_my) {
            //     parent.layout_my = newLayout
            // }
            cc.gameMgr.view.find("nodeBetMove").addChild(layout.node);
            layout.node.position = localPos;
            move(layout.node, localPos, pos, function () {
                layout.node.destroy();
            });
        }

        for (var i = begin; i <= end; i++) {
            var chipArr = this.chipList[i];
            var pos;
            //和局也是移向自己的
            if (-1 != state_info.state_list.indexOf(i) || -1 != state_info.state_list.indexOf(3)) {
                // for (var k in chipArr) {
                //     var chip = chipArr[k]
                //     var pos = getPlayerPos("player" + this.clientSeatId, chip)
                //     chip.getComponent("ChipSmall").settle(pos)
                //     //玩家赢了复制一份筹码出来移动
                //     // var chipClone = cc.instantiate(cc.res["prefabs/chip/ChipSmall"])
                //     // chipClone.getComponent("ChipSmall").setData(chip.getComponent("ChipSmall").getValue())
                //     // var parent = gameView.getPlayerBetParent(this.getClientSeatId(), i)
                //     // chipClone.parent = parent
                //     // chipClone.position = {x:50, y:0}
                //     // chipClone.getComponent("ChipSmall").settle(pos)
                // }
                pos = getPlayerPos("player" + this.clientSeatId);
            } else {
                // for (var k in chipArr) {
                //     var chip = chipArr[k]
                //     var pos = getPlayerPos("player0", chip)
                //     chip.getComponent("ChipSmall").settle(pos)
                // }
                pos = getPlayerPos("player0");
            }
            cloneLayoutAndMove(i, pos);
            //和 庄对 闲对还要处理别人的筹码
            if (i >= 3) {
                cloneLayoutAndMove(i, pos, true);
            }
            this.chipList[i] = [];
        }
        if (this.data) {
            this.updateChipTxtNum();
        }
    },

    //重连的时候设置玩家下注状况
    setBetInfo: function setBetInfo(info) {
        var gameView = cc.gameMgr.view;
        var chipValueArr = [];
        for (var i = 5; i >= 1; i--) {
            chipValueArr.push(Number(gameView.find("chip" + i).value.string));
        }

        for (var i = 0; i < info.state_bet.length; i++) {
            var bet = info.state_bet[i];
            this.setChipsOnArea(bet.jetton, bet.state);
        }
    },

    showBubble: function showBubble(data) {
        var self = this;
        // var imgBubble = this.find("imgBubble")
        this.imgBubble.active = true;
        this.imgBubble.stopAllActions();
        this.imgBubble.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function () {
            self.imgBubble.active = false;
        })));

        var txtContent = this.imgBubble.getChildByName("txtContent");
        var imgEmoji = this.imgBubble.getChildByName("imgEmoji");
        var voiceEffect = this.imgBubble.getChildByName("voiceEffect").getComponent(cc.Animation);

        txtContent.active = false;
        imgEmoji.active = false;
        //表情
        if (3 == data.type) {
            imgEmoji.active = true;
            this.imgBubble.setContentSize({ width: 94, height: 84 });
            // this.find("imgEmoji").spriteFrame = this.find(data.words).getComponent(cc.Sprite).spriteFrame
            cc.resMgr.updateSprite(imgEmoji.getComponent(cc.Sprite), "expression/" + data.words);
        } else if (4 == data.type) {
            //txtContent.active = true
            //txtContent.getComponent(cc.Label).string = "语音"
            //var size = txtContent.getContentSize()
            this.imgBubble.setContentSize({ width: 90, height: 60 });
            voiceEffect.play();
            record.getInstance().downloadVoice(data.words);
        } else {
            txtContent.active = true;
            var wordsStr = data.words;
            if (1 == data.type) //常用语播放语音去除前两个字符
                {
                    cc.log("showBubble  playVoice");
                    if (this.getUid() != gUserData.uid) //不是自己才播放语音
                        {
                            var playVoice = "placeVoice/" + wordsStr + ".mp3";
                            cc.log("playVoice: ", playVoice);
                            cc.musicMgr.playEffect(playVoice);
                        }
                    wordsStr = wordsStr.substr(2);
                }
            txtContent.getComponent(cc.Label).string = wordsStr;
            var size = txtContent.getContentSize();
            this.imgBubble.setContentSize({ width: size.width + 30, height: size.height + 20 });
        }
    },

    timeInterval: function timeInterval(detalTime) {
        //傻逼creator模拟器不知道为什么退出房间的时候说this.pb为空，所以处理了一下
        if (!this.pb || this.pb.progress <= 0) {
            cc.director.getScheduler().unschedule(this.tmpInterval, this);
            cc.musicMgr.stop(this.timerAudioId);
            this.timerAudioId = null;
            this.tmpInterval = null;
            return;
        }
        this.leftTime = this.leftTime - detalTime;
        this.pb.progress = this.leftTime / this.totalTime;

        var isBetState = function () {
            var state = gUserData.roomInfo.game_status;
            return stateEnmu.BETTING == state || stateEnmu.BETTING_DELAY == state;
        }.bind(this);

        //下注阶段最后5秒才需要播放滴滴滴的音效
        if (this.leftTime <= 5.0 && !this.timerAudioId && isBetState()) {
            this.timerAudioId = cc.musicMgr.playEffect("daojishi.mp3", true);
        }
    },

    launchTimer: function launchTimer(leftTime, totalTime) {
        if (!this.pb_timer) {
            return;
        }
        this.pb_timer.active = true;
        this.leftTime = leftTime;
        this.totalTime = totalTime;
        this.pb.progress = leftTime / totalTime;
        //模拟器或真机上，如果不判断句柄是否在调度，会报错，所以需要判断一下
        if (this.tmpInterval) {
            cc.director.getScheduler().unschedule(this.tmpInterval, this);
            cc.musicMgr.stop(this.timerAudioId);
            this.timerAudioId = null;
        }
        this.tmpInterval = this.timeInterval;
        cc.director.getScheduler().schedule(this.tmpInterval, this, 0);
    },

    hideTimer: function hideTimer() {
        this.pb_timer.active = false;
        cc.musicMgr.stop(this.timerAudioId);
        this.timerAudioId = null;
        if (this.find("firstTipsNode")) this.find("firstTipsNode").active = false;
    },

    showMoveFirstTips: function showMoveFirstTips() {
        if (cc.sys.localStorage.getItem("showMoveFirstTips")) return;

        cc.log("showMoveFirstTips");
        this.find("backGround").getComponent(cc.Animation).play();
        this.find("tipsLabelBackGround").getComponent(cc.Animation).play();
        this.find("firstTipsNode").active = true;
        cc.sys.localStorage.setItem("showMoveFirstTips", 1);
    },

    hideoveFirstTips: function hideoveFirstTips() {
        this.find("firstTipsNode").active = false;
    },

    //播放筹码掉落动画
    playChipFallAni: function playChipFallAni() {
        var aniWin = this.find("aniWin");
        aniWin.active = true;
        aniWin.getComponent(cc.Animation).play();

        var avatarAnimation = this.find("avatarAnimation");
        avatarAnimation.active = true;
        avatarAnimation.getComponent(cc.Animation).play();

        var avatarParticle = this.find("avatarParticle");
        avatarParticle.resetSystem();

        var avatarAnimationUp = this.find("avatarAnimationUp");
        avatarAnimationUp.getComponent(cc.Animation).play();
    },

    //可以转移挤牌权给其他人的动画
    showCanMovePowerObjAni: function showCanMovePowerObjAni() {
        this.optional.active = true;
        this.optional.opacity = 255;
        this.optional.getComponent(cc.Animation).play();
    }
});

cc._RF.pop();