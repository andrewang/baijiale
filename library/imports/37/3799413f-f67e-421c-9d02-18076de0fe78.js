"use strict";
cc._RF.push(module, '37994E/9n5CHJ0CGAdt4P54', 'NoticeView');
// scripts/app/lobby/view/notice/NoticeView.js

"use strict";

var BaseView = require("BaseView");

cc.Class({
    extends: BaseView,

    properties: {},

    onLoad: function onLoad() {
        this._super();
        this.toggleActivity = this.find("toggleActivity");
        this.toggleAnnounce = this.find("toggleAnnounce");
        this.imgContent = this.find("imgContent");
        cc.eventMgr.addEvent("selectNoticeItem", this.showItemContent, this);
    },

    //data:items {Notice结构体,...}
    setData: function setData(data) {
        this.data = data;
        this.announceList = [];
        this.activityList = [];
        for (var i = 0; i < this.data.length; i++) {
            var element = this.data[i];
            if (0 == element.type) {
                this.announceList.push(element);
            } else {
                this.activityList.push(element);
            }
        }
    },

    //显示公告或者活动（公告0 活动1）
    showType: function showType(type) {
        if (!this.scContent) {
            this.scContent = this.find("scContent");
        }
        if (!this.data) {
            return;
        }
        this.scContent.removeAllChildren();
        var list;
        if (0 == type) {
            list = this.announceList;
        } else {
            list = this.activityList;
        }
        for (var i = 0; i < list.length; i++) {
            var element = list[i];
            if (type == element.type) {
                var prefab = cc.res["prefabs/notice/noticeItem"];
                var item = cc.instantiate(prefab);
                item.parent = this.scContent;
                item.js = item._components[0];
                item.js.setData(element);
            }
        }
        //如果有item，显示第一个item的内容
        if (list.length > 0) {
            this.imgContent.node.active = true;
            this.showItemContent(list[0]);
        } else {
            this.imgContent.node.active = false;
        }
    },

    show: function show() {
        this._super();
        this.changeToggle();
    },

    hide: function hide() {
        this._super();
    },

    changeToggle: function changeToggle() {
        if (this.toggleActivity.getComponent(cc.Toggle).isChecked) {
            this.showType(1);
        } else {
            this.showType(0);
        }
    },

    showItemContent: function showItemContent(data) {
        cc.resMgr.loadNetUrl(this.find("imgContent"), data.content);
    },

    onDestroy: function onDestroy() {
        this._super();
        cc.eventMgr.removeEvent("selectNoticeItem", this.showItemContent);
    }

});

cc._RF.pop();