var BaseView = require("BaseView")
var http = require("Http")

cc.Class({
    extends: BaseView,

    properties: {

    },

    onLoad: function () {
        this._super()
        this.svLayout = this.find("svLayout")
        this.noItemsLabel = this.find("noItemsLabel")

        this.find("scrollview").on('scroll-to-bottom', function () {
            this.reqGetData()
        }, this)

        // this.test()
    },

    reqGetData: function () {
        var self = this
        var data = { page: this.iPage , uid: gUserData.uid}
        http.sendRequest("/game/room_record", data, function (ret) {
            cc.log(ret)
            cc.netMgr.exec(ret, function () {
                self.addItem(ret.room_record_info_list)
                self.iPage ++
            })
        })
    },

    test: function () {
        for (var i = 0; i < 12; i++) {
            var item = cc.instantiate(cc.res["prefabs/battleRecord/TotalBattleRecordItem"])
            item.js = item.getComponent("TotalBattleRecordItem")
            item.parent = this.svLayout.node
        }
        setTimeout(function () {
            cc.log("2222", this.svLayout, this.svLayout.node.getContentSize().height, this.svLayout._layoutSize.height)
            this.find("sv_content").setContentSize({ width: 960, height: this.svLayout.node.getContentSize().height - 120})
        }.bind(this), 200)
    },

    addItem: function (room_record_info_list) {
        this.noItemsLabel.node.active = false
        for (var i = 0; i < room_record_info_list.length; i++) {
            var data = room_record_info_list[i]
            var item = cc.instantiate(cc.res["prefabs/battleRecord/TotalBattleRecordItem"])
            item.js = item.getComponent("TotalBattleRecordItem")
            item.parent = this.svLayout.node
            item.js.setData(data)
        }
        setTimeout(function () {
            this.find("sv_content").setContentSize({ width: 960, height: this.svLayout.node.getContentSize().height - 120})
        }.bind(this), 200)
    },

    show: function () {
        this._super()

        this.svLayout.node.removeAllChildren()
        this.totalHeight = 0
        this.iPage = 1
        this.reqGetData()
        if (this.noItemsLabel.node.active)
        {
            this.noItemsLabel.node.opacity = 0
            this.noItemsLabel.node.runAction(cc.fadeTo(1, 255))
        }
    },

});
