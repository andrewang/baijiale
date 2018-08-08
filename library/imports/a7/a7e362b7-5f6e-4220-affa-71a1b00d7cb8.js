"use strict";
cc._RF.push(module, 'a7e36K3X25CIK/6caGwDXy4', 'LoadingView');
// scripts/common/loading/LoadingView.js

"use strict";

var BaseView = require("BaseView");
var guanxiaoOffset = 5;
cc.Class({
    extends: BaseView,

    properties: {},

    start: function start() {},

    onLoad: function onLoad() {
        // cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LOADING,function () {
        //     cc.log("Director: 加载新场景之前所触发的事件")
        // })

        // cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, function () {
        //     cc.log("Director: 运行新场景之前所触发的事件")
        // })

        // cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
        //     cc.log("Director: 运行新场景之后所触发的事件")
        // })

        // cc.director.on(cc.Director.EVENT_BEFORE_VISIT, function () {
        //     cc.log("Director: 渲染后")
        // })

        // cc.director.on(cc.Director.EVENT_AFTER_DRAW, function () {
        //     cc.log("Director: 渲染后")
        // })

        this.progress_bar_node = this.find("progress_bar").node;
        this.guanxiao_node = this.find("guanxiao").node;
    },

    onEnable: function onEnable() {
        // cc.log("LoadingView onEnable")
        // var self = this
        // cc.loader.onProgress = function (completedCount, totalCount, item) {
        //     var progress = Number((completedCount / totalCount).toFixed(2))
        //     if (item && item.uuid && self.progress_bar_node && self.guanxiao_node && progress > self.progress_bar_node.getComponent(cc.Sprite).fillRange) {
        //         //cc.log("completedCount = " + completedCount + ", totalCount = " + totalCount + ", progress = " + progress);
        //         self.guanxiao_node.x = guanxiaoOffset + progress * self.progress_bar_node.width
        //         self.progress_bar_node.getComponent(cc.Sprite).fillRange = progress
        //     }
        // };

        cc.eventMgr.addEvent("loadRes", this.updateProgress, this);
    },

    onDisable: function onDisable() {
        // cc.log("LoadingView onDisable")
        // this.guanxiao_node.x = guanxiaoOffset
        // this.progress_bar_node.getComponent(cc.Sprite).fillRange = 0

        cc.eventMgr.removeEvent("loadRes", this.updateProgress);
    },

    updateProgress: function updateProgress(params) {
        var progress = Number((params.completeNum / params.loadNum).toFixed(2));
        this.guanxiao_node.x = guanxiaoOffset + progress * this.progress_bar_node.width;
        this.progress_bar_node.getComponent(cc.Sprite).fillRange = progress;
    }

});

cc._RF.pop();