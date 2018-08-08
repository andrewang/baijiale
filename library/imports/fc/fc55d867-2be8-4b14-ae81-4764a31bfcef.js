"use strict";
cc._RF.push(module, 'fc55dhnK+hLFK6BR2SjG/zv', 'FlipBtn');
// scripts/app/game/FlipBtn.js

"use strict";

//挤牌权转移的对象
var BaseObj = require("BaseObj");
var stateEnmu = require("GameConfig").stateEnmu;
cc.Class({
    extends: BaseObj,

    properties: {},

    onLoad: function onLoad() {
        this.pb_timer = this.find("pb_timer");
        this.pb = this.pb_timer.getComponent(cc.ProgressBar);
        this.hideTimer();
    },

    timeInterval: function timeInterval(detalTime) {
        //傻逼creator模拟器不知道为什么退出房间的时候说this.pb为空，所以处理了一下
        if (!this.pb || this.pb.progress <= 0) {
            cc.director.getScheduler().unschedule(this.tmpInterval, this
            // cc.musicMgr.stop(this.timerAudioId)
            // this.timerAudioId = null
            );this.tmpInterval = null;
            this.hideTimer();
            return;
        }
        this.leftTime = this.leftTime - detalTime;
        this.pb.progress = this.leftTime / this.totalTime;

        // var isBetState = function () {
        //     var state = gUserData.roomInfo.game_status
        //     return stateEnmu.BETTING == state || stateEnmu.BETTING_DELAY == state
        // }.bind(this)

        // //下注阶段最后5秒才需要播放滴滴滴的音效
        // if (this.leftTime <= 5.0 && !this.timerAudioId && isBetState()) {
        //     this.timerAudioId = cc.musicMgr.playEffect("daojishi.mp3", true)
        // }
    },

    launchTimer: function launchTimer(leftTime, totalTime) {
        if (!this.pb_timer) {
            return;
        }
        this.node.active = true;
        // this.pb_timer.active = true
        this.leftTime = leftTime;
        this.totalTime = totalTime;
        this.pb.progress = leftTime / totalTime;
        //模拟器或真机上，如果不判断句柄是否在调度，会报错，所以需要判断一下
        if (this.tmpInterval) {
            cc.director.getScheduler().unschedule(this.tmpInterval, this
            // cc.musicMgr.stop(this.timerAudioId)
            // this.timerAudioId = null
            );
        }
        this.tmpInterval = this.timeInterval;
        cc.director.getScheduler().schedule(this.tmpInterval, this, 0);
    },

    hideTimer: function hideTimer() {
        // this.pb_timer.active = false
        this.node.active = false;
    }
});

cc._RF.pop();