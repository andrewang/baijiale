var BaseView = require("BaseView")
var http = require("Http")
var serverRoomDesc = require("JoinRoomConfig").serverRoomDesc

cc.Class({
    extends: BaseView,

    properties: {

    },

    onLoad: function () {
        this._super()
        this.svLayout = this.find("svLayout")
        this.lock = true
        this.find("scrollview").on('scroll-to-bottom', function () {
            if (this.lock)
            {
                this.lock = false
                this.reqGameRecord(this.rid)
            }
        }, this)
    },

    // setData: function (data) {
     setRoomInfo: function (data) {
        this.find("txtRoomId").string = "房间号:" + data.room_num
        // this.find("txtYazhu").string = "最低-最高:" + serverRoomDesc["bet_limit_type"][data.bet_limit_type]
        this.find("txtYazhu").string = "最低-最高:" + data.low_bet + "-" + data.hig_bet
        // this.find("txtJushu").string = "局数:" + serverRoomDesc["inning_limit_type"][data.inning_limit_type]
        this.find("txtJushu").string = "局数:" + data.max_inning_num
        var newDate = new Date()
        newDate.setTime(data.open_room_time * 1000)
        this.find("txtTime").string = formatDate(newDate)
    },

    reqGameRecord: function (rid) {
        this.rid = rid
        var self = this
        http.sendRequest("/game/inning_record", {rid : this.rid, page : this.iPage, uid: gUserData.uid}, function (ret) {
            cc.log(ret)
            cc.netMgr.exec(ret, function () {
                self.addItem(ret.inning_record_info_list)
                self.iPage ++
                self.lock = true
            })
        })
    },

    // reqGameRoomData: function () {
    //     var self = this
    //     var data = { page: 1, uid: gUserData.uid }
    //     http.sendRequest("/game/room_record", data, function (ret) {
    //         cc.log(ret)
    //         cc.netMgr.exec(ret, function () {
    //             for (let index in ret.room_record_info_list)
    //             {
    //                 let Data = ret.room_record_info_list[index]
    //                 if (self.rid == Data.rid)
    //                 {
    //                     self.setData(Data)
    //                     return
    //                 }
    //             }
    //         })
    //     })
    // },

    addItem: function (inning_record_info_list) {
        for (var i = 0; i < inning_record_info_list.length; i++) {
            var data = inning_record_info_list[i]
            var item = cc.instantiate(cc.res["prefabs/battleRecord/SingleBattleRecordItem"])
            item.js = item.getComponent("SingleBattleRecordItem")
            item.parent = this.svLayout.node
            // item.js.owner_uid = this.owner_uid
            item.js.owner_base_info = this.owner_base_info
            item.js.seat_info_list = this.seat_info_list
            item.js.setData(data)
            this.totalHeight += (item.getContentSize().height + this.svLayout.spacingY)
        }
        // this.find("sv_content").setContentSize({ width: 960, height: this.totalHeight })
        setTimeout(function () {
            this.find("sv_content").setContentSize({ width: 960, height: this.svLayout.node.getContentSize().height})
        }.bind(this), 200)
    },

    show: function () {
        this._super()
        this.svLayout.node.removeAllChildren()
        this.totalHeight = 0
        this.iPage = 1
    },

});
