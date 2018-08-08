var BaseView = require("BaseView")

cc.Class({
    extends: BaseView,

    properties: {
        
    },

    onLoad: function () {
        this._super()
        this.toggleActivity = this.find("toggleActivity")
        this.toggleAnnounce = this.find("toggleAnnounce")
        this.imgContent = this.find("imgContent")
        cc.eventMgr.addEvent("selectNoticeItem", this.showItemContent, this)
    },

    //data:items {Notice结构体,...}
    setData: function (data) {
        this.data = data
        this.announceList = []
        this.activityList = []
        for (var i = 0; i < this.data.length; i++) {
            var element = this.data[i]
            if (0 == element.type) {
                this.announceList.push(element)
            }
            else {
                this.activityList.push(element)
            }
        }

        var compare = function (a, b) {//比较函数
            if (a.sort < b.sort) {
                return -1
            } else if (a.sort > b.sort) {
                return 1
            } else {
                if (a.id < b.id) {
                    return - 1
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
        this.announceList.sort(compare)
        this.activityList.sort(compare)

        this.announceList.length == 0 ? this.toggleAnnounce.active = false : this.toggleAnnounce.active = true
        this.activityList.length == 0 ? this.toggleActivity.active = false : this.toggleActivity.active = true
    },

    //显示公告或者活动（公告0 活动1）
    showType: function (type) {
        if (!this.scContent) {
            this.scContent = this.find("scContent")
        }
        if (!this.data) {
            return
        }
        this.scContent.removeAllChildren()
        var list
        if (0 == type) {
            list = this.announceList
        }
        else {
            list = this.activityList
        }
        for (var i = 0; i < list.length; i++) {
            var element = list[i]
            if (type == element.type) {
                var prefab = cc.res["prefabs/notice/noticeItem"]
                var item = cc.instantiate(prefab)
                item.parent = this.scContent
                item.js = item._components[0]
                item.js.setData(element)
            }
        }
        //如果有item，显示第一个item的内容
        if (list.length > 0) {
            this.imgContent.node.active = true
            this.showItemContent(list[0])
        }
        else {
            this.imgContent.node.active = false
        }
    },

    show: function () {
        this._super()
        this.changeToggle()
    },

    hide: function () {
        this._super()
    },

    changeToggle: function () {
        if (this.toggleActivity.getComponent(cc.Toggle).isChecked && true == this.toggleActivity.active) {
            this.showType(1)
        }
        else {
            this.showType(0)
        }
    },

    showItemContent: function (data) {
        cc.resMgr.loadNetUrl(this.find("imgContent"), data.content)
    },

    onDestroy: function () {
        this._super()
        cc.eventMgr.removeEvent("selectNoticeItem", this.showItemContent)
    },

});
